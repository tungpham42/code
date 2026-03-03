import React, { useState } from "react";
import {
  Layout,
  Card,
  Form,
  Input,
  Button,
  Typography,
  Alert,
  Space,
  Spin,
  FloatButton,
  ConfigProvider,
} from "antd";
import {
  RobotOutlined,
  SendOutlined,
  CodeOutlined,
  UserOutlined,
  ProfileOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "./App.css";

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

interface PTCFFormValues {
  persona: string;
  task: string;
  context: string;
  format: string;
}

interface ApiResponse {
  result: string;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [form] = Form.useForm<PTCFFormValues>();

  const handleSubmit = async (values: PTCFFormValues) => {
    setLoading(true);
    setError(null);
    setResult("");

    const promptPayload = `
Persona: ${values.persona}
Task: ${values.task}
Context: ${values.context}
Format: ${values.format}
    `.trim();

    try {
      const response = await axios.post<ApiResponse>(
        "https://groqprompt.netlify.app/api/ai",
        { prompt: promptPayload },
      );

      if (response.data && response.data.result) {
        setResult(response.data.result);
      } else {
        throw new Error("Invalid response structure from API.");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while fetching the response.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#E07A5F", // Warm terracotta
          fontFamily: '"Work Sans", sans-serif',
          borderRadius: 16, // Softer, friendlier edges
          colorTextHeading: "#3D405B", // Deep cozy slate for headings
          colorText: "#4A3F35", // Soft dark brown for body text
          colorBgLayout: "#F4F1DE", // Warm eggshell/cream background
          colorInfo: "#E07A5F",
        },
        components: {
          Card: {
            boxShadowTertiary: "0 8px 24px rgba(224, 122, 95, 0.08)", // Warm shadow
          },
          Input: {
            paddingBlock: 10, // Chunkier, more intuitive inputs
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#3D405B", // Deep slate for contrast
            padding: "0 40px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <CodeOutlined
            style={{ color: "#F2CC8F", fontSize: "28px", marginRight: "16px" }}
          />
          <Title
            level={3}
            style={{ color: "#F4F1DE", margin: 0, fontWeight: 600 }}
          >
            Prompt Studio
          </Title>
        </Header>

        <Content
          style={{
            padding: "50px 20px",
            maxWidth: "900px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card
              title={
                <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                  <RobotOutlined
                    style={{ color: "#E07A5F", marginRight: "8px" }}
                  />
                  Draft Your Prompt
                </span>
              }
              bordered={false}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                // Removed initialValues so fields start entirely empty
              >
                <Form.Item
                  label={<b>Persona</b>}
                  name="persona"
                  rules={[{ required: true, message: "Who should I act as?" }]}
                  tooltip="Who is the AI acting as?"
                >
                  <Input
                    prefix={<UserOutlined style={{ color: "#BDBDBD" }} />}
                    placeholder="e.g., A helpful, cozy React developer..."
                  />
                </Form.Item>

                <Form.Item
                  label={<b>Task</b>}
                  name="task"
                  rules={[{ required: true, message: "What's the main goal?" }]}
                  tooltip="What needs to be done?"
                >
                  <TextArea
                    rows={3}
                    placeholder="e.g., Write a cheerful greeting component..."
                  />
                </Form.Item>

                <Form.Item
                  label={<b>Context</b>}
                  name="context"
                  rules={[
                    { required: true, message: "Provide a little background." },
                  ]}
                  tooltip="What is the background info?"
                >
                  <TextArea
                    rows={3}
                    placeholder="e.g., The app is for a local coffee shop..."
                  />
                </Form.Item>

                <Form.Item
                  label={<b>Format</b>}
                  name="format"
                  rules={[
                    { required: true, message: "How should I present this?" },
                  ]}
                  tooltip="How should the output look?"
                >
                  <Input
                    prefix={<FileTextOutlined style={{ color: "#BDBDBD" }} />}
                    placeholder="e.g., A friendly Markdown guide..."
                  />
                </Form.Item>

                <Form.Item style={{ marginTop: "32px", marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SendOutlined />}
                    loading={loading}
                    size="large"
                    style={{ width: "100%", fontWeight: 600, fontSize: "16px" }}
                  >
                    Spark Magic
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Error Handling */}
            {error && (
              <Alert
                message="Oops! Something went wrong"
                description={error}
                type="error"
                showIcon
                style={{ borderRadius: "12px" }}
              />
            )}

            {/* Results Display */}
            {(result || loading) && (
              <Card
                title={
                  <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                    <ProfileOutlined
                      style={{ color: "#81B29A", marginRight: "8px" }}
                    />
                    AI Response
                  </span>
                }
                bordered={false}
                style={{ minHeight: "200px" }}
              >
                {loading ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <Spin
                      size="large"
                      tip={
                        <span style={{ color: "#E07A5F", fontWeight: 500 }}>
                          Brewing your response...
                        </span>
                      }
                    />
                  </div>
                ) : (
                  <div
                    className="markdown-body"
                    style={{ fontSize: "16px", lineHeight: "1.7" }}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                )}
              </Card>
            )}
          </Space>
        </Content>
      </Layout>
      <FloatButton.BackTop duration={400} />
    </ConfigProvider>
  );
};

export default App;
