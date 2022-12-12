import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import { useCallback, useEffect, useState } from "react";
import { taskFromServer, taskToServer } from "../../DTO/Task";
import useBackend from "../hooks/useBackend";
import { DebounceInput } from "react-debounce-input";
import debounce from 'lodash.debounce';

export default function TaskList() {
  const { sendReq } = useBackend();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    sendReq("tasks", "GET").then((result) => {
      if (result.length) {
        setTasks(result.map(taskFromServer));
      } else {
        setTasks([]);
      }
    });
  }, []);

  const debouncedSaveTask = useCallback(
    debounce((task) => {
      sendReq("tasks/" + task.id, "PUT", taskToServer(task));
    }, 1000),
    [sendReq]
  );

  const handleNameChange = (task, event) => {
    const newTasks = produce(tasks, (draft) => {
      const index = draft.findIndex((t) => t.id === task.id);
      draft[index].name = event.target.value;
    });
    setTasks(newTasks);
    let newTask = newTasks.find(newTask => newTask.id == task.id);

    debouncedSaveTask(newTask);
    //saveTask(newTasks.find((t) => t.id === task.id));
  };

  const handleCompletedChange = (task, event) => {
    const newTasks = produce(tasks, (draft) => {
      const index = draft.findIndex((t) => t.id === task.id);
      draft[index].completed = event.target.checked;
    });
    setTasks(newTasks);
    let newTask = newTasks.find(newTask => newTask.id == task.id);
    debouncedSaveTask(newTask);
    //find changed task from the newTasks and save to backend
    //saveTask(newTasks.find((t) => t.id === task.id));
  };

  const handleAddTask = () => {
    setTasks(
      produce(tasks, (draft) => {
        draft.push({
          id: Math.floor(Math.random() * 9999),
          name: "",
          completed: false,
        });
      })
    );
    sendReq("tasks", "POST", { title: "Task" });
  };

  const handleDeleteTask = (task) => {
    setTasks(
      produce(tasks, (draft) => {
        const index = draft.findIndex((t) => t.id === task.id);
        draft.splice(index, 1);
      })
    );
    sendReq(`tasks/${task.id}`, "DELETE");
  };

  /*
  const saveTask = (task) => {
    if (!task.id) {
      sendReq(`tasks/${task.id}`, "POST", taskToServer(task));
    } else {
      sendReq(`tasks/${task.id}`, "PUT", taskToServer(task));
    }
  };
  */

  return (
    <Row
      type="flex"
      justify="center"
      style={{ minHeight: "100vh", marginTop: "6rem" }}
    >
      <Col span={12}>
        <h1>Task List</h1>
        <Button onClick={handleAddTask}>Add Task</Button>
        <Divider />
        <List
          size="small"
          bordered
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item key={task.id}>
              <Row
                type="flex"
                justify="space-between"
                align="middle"
                style={{ width: "100%" }}
              >
                <Space>
                  <Checkbox
                    checked={task.completed}
                    onChange={(e) => handleCompletedChange(task, e)}
                  />
                  <DebounceInput
                    className="deb-input"
                    value={task.name}
                    debounceTimeout={500}
                    onChange={(event) => handleNameChange(task, event)}
                  />
                </Space>
                <Button type="text" onClick={() => handleDeleteTask(task)}>
                  <DeleteOutlined />
                </Button>
              </Row>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}
