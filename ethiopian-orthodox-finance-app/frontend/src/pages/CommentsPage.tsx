import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiChatCircleDotsBold, PiPaperPlaneTiltBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type CommentRecord = {
  id: string;
  author: string;
  avatar?: string;
  message: string;
  context: string;
  createdAt: string;
  translatedMessage?: string;
};

const CommentsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      try {
        const response = await apiClient.get<CommentRecord[]>("/comments");
        if (isMounted) setComments(response.data);
      } catch (error) {
        if (isMounted)
          setComments([
            {
              id: "CMT-101",
              author: "Selam Abebe",
              message: t("comments.sample.messages.audit").toString(),
              context: t("comments.sample.contexts.audit").toString(),
              createdAt: new Date().toISOString(),
            },
            {
              id: "CMT-100",
              author: "Abba Yohannes",
              message: t("comments.sample.messages.thankYou").toString(),
              translatedMessage: t("comments.sample.messages.thankYouAm").toString(),
              context: t("comments.sample.contexts.general").toString(),
              createdAt: new Date(Date.now() - 3600000).toISOString(),
            },
          ]);
      }
    };

    fetchComments();
    return () => {
      isMounted = false;
    };
  }, [t]);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    const newComment: CommentRecord = {
      id: `CMT-${Date.now()}`,
      author: t("comments.currentUser"),
      message,
      context: t("comments.form.defaultContext"),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [newComment, ...prev]);
    setMessage("");
    try {
      await apiClient.post("/comments", {
        ...newComment,
        language: i18n.language,
      });
      toast({
        title: t("comments.form.success"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("comments.form.error"),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Stack spacing={2}>
          <Heading size="2xl" color="brand.deepGreen">
            {t("comments.title")}
          </Heading>
          <Text color="brand.textMuted">{t("comments.subtitle")}</Text>
        </Stack>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Flex align="center" gap={3}>
              <PiChatCircleDotsBold size={28} color="#A4252E" />
              <Stack spacing={1}>
                <Heading size="md" color="brand.deepGreen">
                  {t("comments.form.title")}
                </Heading>
                <Text fontSize="sm" color="brand.textMuted">
                  {t("comments.form.subtitle")}
                </Text>
              </Stack>
            </Flex>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <Stack spacing={4}>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t("comments.form.placeholder") ?? ""}
                borderColor="brand.goldSoft"
                focusBorderColor="brand.gold"
                minH="120px"
              />
              <Flex justify="flex-end">
                <Button
                  leftIcon={<PiPaperPlaneTiltBold />}
                  colorScheme="brandGreen"
                  bg="brand.green"
                  color="white"
                  _hover={{ bg: "brand.greenDeep" }}
                  onClick={handleSubmit}
                >
                  {t("comments.form.submit")}
                </Button>
              </Flex>
            </Stack>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="xl">
          <CardHeader>
            <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
              <Stack spacing={1}>
                <Heading size="md" color="brand.deepGreen">
                  {t("comments.feed.title")}
                </Heading>
                <Text fontSize="sm" color="brand.textMuted">
                  {t("comments.feed.subtitle", { count: comments.length })}
                </Text>
              </Stack>
              <AvatarGroup size="sm" max={4}>
                {comments.slice(0, 4).map((comment) => (
                  <Avatar key={comment.id} name={comment.author} bg="brand.gold" color="brand.deepGreen" />
                ))}
              </AvatarGroup>
            </Flex>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <Stack spacing={5}>
              {comments.map((comment) => (
                <Box
                  key={comment.id}
                  border="1px solid"
                  borderColor="brand.goldSoft"
                  borderRadius="xl"
                  bg="brand.goldSoft"
                  p={5}
                >
                  <Stack spacing={3}>
                    <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={3}>
                      <Flex align="center" gap={3}>
                        <Avatar name={comment.author} bg="brand.deepGreen" color="white" />
                        <Stack spacing={0}>
                          <Text fontWeight="semibold" color="brand.deepGreen">
                            {comment.author}
                          </Text>
                          <Text fontSize="xs" color="brand.textMuted">
                            {new Date(comment.createdAt).toLocaleString("fr-FR")}
                          </Text>
                        </Stack>
                      </Flex>
                      <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                        {comment.context}
                      </Badge>
                    </Flex>
                    <Text color="brand.deepGreen">{comment.message}</Text>
                    {comment.translatedMessage && (
                      <Box bg="white" borderRadius="md" border="1px dashed" borderColor="brand.gold">
                        <Text fontSize="sm" color="brand.textMuted" px={4} py={3}>
                          {comment.translatedMessage}
                        </Text>
                      </Box>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};

export default CommentsPage;