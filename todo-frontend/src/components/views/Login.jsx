import { Form, Input, Button, Row, Col, notification } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useLocalStorage from "use-local-storage";
import useBackend from "../hooks/useBackend";

export default function Login() {
  const navigate = useNavigate();
  const { sendReq } = useBackend();
  const [accessToken, setAccessToken] = useLocalStorage("accessToken", "");

  const onFinish = (values) => {
    console.log("Success:", values);
    sendReq("users/get-token", "POST", values).then((res) => {
      if (!res.hasOwnProperty("access_token")) {
        notification.error({
          message: "Wrong username or password",
        });
      }
      notification.success({
        message: "Logged in",
      });
      setAccessToken(res.access_token);
      //console.log(res);
      //navigate("/");
    });
  };

  useEffect(() => {
    if (accessToken) navigate("/");
  }, [accessToken]);

  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
    >
      <Col span={4}>
        <h1>Login</h1>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ username: "", password: "" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
