import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Stack,
  Switch,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiBellBold, PiBellRingingBold, PiCheckBold, PiTrashBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type NotificationRecord = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  category: "finance" | "community" | "system";
  read: boolean;
  channel: "email" | "sms" | "push";
};

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    push: true,
  });
  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await apiClient.get<NotificationRecord[]>("/notifications");
        if (isMounted) {
          setNotifications(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setNotifications([
            {
              id: "NT-101",
              title: t("notifications.sample.audit.title").toString(),
              body: t("notifications.sample.audit.body").toString(),
              createdAt: new Date().toISOString(),
              category: "finance",
              read: false,
              channel: "email",
            },
            {
              id: "NT-102",
              title: t("notifications.sample.event.title").toString(),
              body: t("notifications.sample.event.body").toString(),
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              category: "community",
              read: true,
              channel: "push",
            },
          ]);
        }
      }
    };

    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, [t]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    toast({
      title: t("notifications.actions.markReadSuccess"),
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const clearRead = () => {
    setNotifications((prev) => prev.filter((item) => !item.read));
    toast({
      title: t("notifications.actions.clearReadSuccess"),
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const togglePreference = async (channel: "email" | "sms" | "push") => {
    const next = { ...preferences, [channel]: !preferences[channel] };
    setPreferences(next);
    try {
      await apiClient.put("/notifications/preferences", next);
      toast({
        title: t("notifications.preferences.updateSuccess"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("notifications.preferences.updateError"),
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const renderCategoryBadge = (category: NotificationRecord["category"]) => {
    const mapping: Record<NotificationRecord["category"], { label: string; colorScheme: string }> = {
      finance: { label: t("notifications.categories.finance"), colorScheme: "green" },
      community: { label: t("notifications.categories.community"), colorScheme: "yellow" },
      system: { label: t("notifications.categories.system"), colorScheme: "red" },
    };
    const item = mapping[category];
    return (
      <Badge colorScheme={item.colorScheme} borderRadius="full" px={3} py={1}>
        {item.label}
      </Badge>
    );
  };

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap={4}>
          <Stack spacing={2}>
            <Heading size="2xl" color="brand.deepGreen">
              {t("notifications.title")}
            </Heading>
            <Text color="brand.textMuted">{t("notifications.subtitle")}</Text>
          </Stack>
          <Flex gap={3} wrap="wrap">
            <Button
              leftIcon={<PiCheckBold />}
              colorScheme="brandGreen"
              bg="brand.green"
              color="white"
              _hover={{ bg: "brand.greenDeep" }}
              onClick={markAllRead}
            >
              {t("notifications.actions.markAllRead")}
            </Button>
            <Button
              leftIcon={<PiTrashBold />}
              variant="outline"
              colorScheme="brandRed"
              borderColor="brand.deepRed"
              color="brand.deepRed"
              _hover={{ bg: "rgba(164,37,46,0.08)" }}
              onClick={clearRead}
            >
              {t("notifications.actions.clearRead")}
            </Button>
          </Flex>
        </Flex>

        <Card bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("notifications.preferences.title")}
            </Heading>
            <Text fontSize="sm" color="brand.textMuted">
              {t("notifications.preferences.subtitle")}
            </Text>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {(["email", "sms", "push"] as Array<"email" | "sms" | "push">).map((channel) => (
                <Flex key={channel} justify="space-between" align="center">
                  <Stack spacing={0}>
                    <Text fontWeight="semibold" color="brand.deepGreen">
                      {t(`notifications.preferences.channels.${channel}.title`)}
                    </Text>
                    <Text fontSize="sm" color="brand.textMuted">
                      {t(`notifications.preferences.channels.${channel}.description`)}
                    </Text>
                  </Stack>
                  <Switch
                    colorScheme="brandGreen"
                    isChecked={preferences[channel]}
                    onChange={() => togglePreference(channel)}
                  />
                </Flex>
              ))}
            </Stack>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="xl">
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Stack spacing={1}>
                <Heading size="md" color="brand.deepGreen">
                  {t("notifications.feed.title")}
                </Heading>
                <Text fontSize="sm" color="brand.textMuted">
                  {t("notifications.feed.subtitle", { count: notifications.filter((item) => !item.read).length })}
                </Text>
              </Stack>
              <IconButton
                aria-label={t("notifications.actions.refresh")}
                icon={<PiBellRingingBold />}
                variant="outline"
                colorScheme="brandGold"
                borderColor="brand.gold"
                color="brand.deepGreen"
                _hover={{ bg: "brand.goldSoft" }}
                onClick={() => window.location.reload()}
              />
            </Flex>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <VStack align="stretch" spacing={4}>
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  border="1px solid"
                  borderColor={notification.read ? "brand.goldSoft" : "brand.gold"}
                  borderRadius="xl"
                  bg={notification.read ? "white" : "rgba(230,180,34,0.12)"}
                  p={5}
                >
                  <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={4}>
                    <Flex align="center" gap={3}>
                      <Icon
                        as={notification.read ? PiBellBold : PiBellRingingBold}
                        color={notification.read ? "brand.textMuted" : "brand.deepRed"}
                        boxSize={6}
                      />
                      <Stack spacing={1}>
                        <Text fontWeight="semibold" color="brand.deepGreen">
                          {notification.title}
                        </Text>
                        <Text fontSize="sm" color="brand.textMuted">
                          {notification.body}
                        </Text>
                        <Flex align="center" gap={3} flexWrap="wrap">
                          {renderCategoryBadge(notification.category)}
                          <Badge borderRadius="full" px={3} py={1} colorScheme="purple">
                            {t(`notifications.channels.${notification.channel}`)}
                          </Badge>
                          <Text fontSize="xs" color="brand.textMuted">
                            {new Date(notification.createdAt).toLocaleString("fr-FR")}
                          </Text>
                        </Flex>
                      </Stack>
                    </Flex>
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        colorScheme="brandGreen"
                        borderColor="brand.green"
                        color="brand.deepGreen"
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
                          )
                        }
                      >
                        {t("notifications.actions.markRead")}
                      </Button>
                    )}
                  </Flex>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};

export default NotificationsPage;