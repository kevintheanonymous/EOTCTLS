import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiCheckBold, PiClockBold, PiXCircleBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type ApprovalRequest = {
  id: string;
  title: string;
  requester: string;
  submittedAt: string;
  amount: number;
  category: string;
  status: "pending" | "approved" | "rejected";
  notes: string;
};

const ApprovalsPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchApprovals = async () => {
      try {
        const response = await apiClient.get<ApprovalRequest[]>("/approvals");
        if (isMounted) setApprovals(response.data);
      } catch (error) {
        if (isMounted)
          setApprovals([
            {
              id: "APR-2025-07",
              title: t("approvals.sample.titles.purchase").toString(),
              requester: "Mariam Bekele",
              submittedAt: new Date().toISOString(),
              amount: 720,
              category: t("approvals.sample.categories.maintenance").toString(),
              status: "pending",
              notes: t("approvals.sample.notes.purchase").toString(),
            },
            {
              id: "APR-2025-06",
              title: t("approvals.sample.titles.outreach").toString(),
              requester: "Kidist Fisseha",
              submittedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
              amount: 450,
              category: t("approvals.sample.categories.charity").toString(),
              status: "approved",
              notes: t("approvals.sample.notes.outreach").toString(),
            },
            {
              id: "APR-2025-05",
              title: t("approvals.sample.titles.upgrade").toString(),
              requester: "Abba Yohannes",
              submittedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
              amount: 1200,
              category: t("approvals.sample.categories.operations").toString(),
              status: "rejected",
              notes: t("approvals.sample.notes.upgrade").toString(),
            },
          ]);
      }
    };

    fetchApprovals();
    return () => {
      isMounted = false;
    };
  }, [t]);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setApprovals((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    try {
      await apiClient.put(`/approvals/${id}`, { status });
      toast({
        title: t(`approvals.notifications.${status}`),
        status: status === "approved" ? "success" : "warning",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("approvals.notifications.error"),
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
            {t("approvals.title")}
          </Heading>
          <Text color="brand.textMuted">{t("approvals.subtitle")}</Text>
        </Stack>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="xl">
          <CardHeader>
            <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap={3}>
              <Stack spacing={1}>
                <Heading size="md" color="brand.deepGreen">
                  {t("approvals.table.title")}
                </Heading>
                <Text fontSize="sm" color="brand.textMuted">
                  {t("approvals.table.subtitle", { count: approvals.filter((item) => item.status === "pending").length })}
                </Text>
              </Stack>
            </Flex>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="brand.goldSoft">
                  <Tr>
                    <Th>{t("approvals.table.headers.reference")}</Th>
                    <Th>{t("approvals.table.headers.title")}</Th>
                    <Th>{t("approvals.table.headers.requester")}</Th>
                    <Th>{t("approvals.table.headers.submittedAt")}</Th>
                    <Th isNumeric>{t("approvals.table.headers.amount")}</Th>
                    <Th>{t("approvals.table.headers.category")}</Th>
                    <Th>{t("approvals.table.headers.status")}</Th>
                    <Th>{t("approvals.table.headers.actions")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {approvals.map((request) => (
                    <Tr key={request.id} _hover={{ bg: "brand.goldSoft" }}>
                      <Td fontWeight="semibold" color="brand.deepGreen">
                        {request.id}
                      </Td>
                      <Td>{request.title}</Td>
                      <Td>{request.requester}</Td>
                      <Td>{new Date(request.submittedAt).toLocaleDateString("fr-FR")}</Td>
                      <Td isNumeric>
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(request.amount)}
                      </Td>
                      <Td>
                        <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                          {request.category}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            request.status === "approved"
                              ? "green"
                              : request.status === "rejected"
                              ? "red"
                              : "yellow"
                          }
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {t(`approvals.status.${request.status}`)}
                        </Badge>
                      </Td>
                      <Td>
                        {request.status === "pending" ? (
                          <Flex gap={2}>
                            <Button
                              size="sm"
                              colorScheme="brandGreen"
                              bg="brand.green"
                              color="white"
                              _hover={{ bg: "brand.greenDeep" }}
                              display="inline-flex"
                              alignItems="center"
                              gap={2}
                              onClick={() => updateStatus(request.id, "approved")}
                            >
                            <Button
                              size="sm"
                              variant="outline"
                              colorScheme="brandRed"
                              borderColor="brand.deepRed"
                              color="brand.deepRed"
                              _hover={{ bg: "rgba(164,37,46,0.08)" }}
                              display="inline-flex"
                              alignItems="center"
                              gap={2}
                              onClick={() => updateStatus(request.id, "rejected")}
                            >
                              <PiXCircleBold />
                              {t("approvals.actions.reject")}
                            </Button>
                            >
                              {t("approvals.actions.reject")}
                            </Button>
                          </Flex>
                        ) : (
                          <Flex align="center" gap={2} color="brand.textMuted">
                            <PiClockBold />
                            <Text fontSize="sm">{t("approvals.actions.noAction")}</Text>
                          </Flex>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};

export default ApprovalsPage;