import { DeleteOutlined } from "@ant-design/icons";
import { Input, Button, Checkbox, List, Col, Row, Space, Divider } from "antd";
import produce from "immer";
import { useEffect } from "react";
import { useState } from "react";
import { taskFromServer } from "../../DTO/Task";

export default function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1", completed: false },
    { id: 2, name: "Task 2", completed: true },
  ]);

  useEffect(() => {
    //get my tasks, request pasted from postman
    var myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      "Bearer fh-23k1Yxho7yVDQb3_CQODspoevhQFE"
    );
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://demo2.z-bit.ee/tasks", requestOptions)
      .then((response) => response.json())
      .then((result) => setTasks(result.map(taskFromServer)))
      .catch((error) => console.log("error", error));
  }, []);

  const handleNameChange = (task, event) => {
    console.log(event);
    const newTasks = produce(tasks, (draft) => {
      const index = draft.findIndex((t) => t.id === task.id);
      draft[index].name = event.target.value;
    });
    setTasks(newTasks);
  };

  const handleCompletedChange = (task, event) => {
    console.log(event);
    const newTasks = produce(tasks, (draft) => {
      const index = draft.findIndex((t) => t.id === task.id);
      draft[index].completed = event.target.checked;
    });
    setTasks(newTasks);
  };

  const handleAddTask = () => {
    setTasks(
      produce(tasks, (draft) => {
        draft.push({
          id: Math.random(),
          name: "",
          completed: false,
        });
      })
    );
  };

  const handleDeleteTask = (task) => {
    setTasks(
      produce(tasks, (draft) => {
        const index = draft.findIndex((t) => t.id === task.id);
        draft.splice(index, 1);
      })
    );
  };

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
                  <Input
                    value={task.name}
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
