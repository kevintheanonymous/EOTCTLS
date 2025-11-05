import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiShieldCheckeredBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type AuditRecord = {
  id: string;
  actor: string;
  action: string;
  entity: string;
  timestamp: string;
  severity: "info" | "warning" | "critical";
  ipAddress: string;
};

const AuditLogPage: React.FC = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState<AuditRecord[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      try {
        const response = await apiClient.get<AuditRecord[]>("/audit");
        if (isMounted) setRecords(response.data);
      } catch (error) {
        if (isMounted)
          setRecords([
            {
              id: "AUD-2025-12",
              actor: "system",
              action: t("audit.sample.actions.loginSuccess").toString(),
              entity: "auth",
              timestamp: new Date().toISOString(),
              severity: "info",
              ipAddress: "185.15.12.40",
            },
            {
              id: "AUD-2025-11",
              actor: "kidane.h",
              action: t("audit.sample.actions.updateFund").toString(),
              entity: "funds/FND-002",
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              severity: "warning",
              ipAddress: "185.15.10.11",
            },
            {
              id: "AUD-2025-10",
              actor: "admin",
              action: t("audit.sample.actions.permissionChange").toString(),
              entity: "members/MBR-001",
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              severity: "critical",
              ipAddress: "185.15.10.20",
            },
          ]);
      }
    };

    fetchLogs();
    return () => {
      isMounted = false;
    };
  }, [t]);

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Flex align="center" gap={3}>
          <PiShieldCheckeredBold size={32} color="#A4252E" />
          <Stack spacing={2}>
            <Heading size="2xl" color="brand.deepGreen">
              {t("audit.title")}
            </Heading>
            <Text color="brand.textMuted">{t("audit.subtitle")}</Text>
          </Stack>
        </Flex>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="xl">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("audit.table.title")}
            </Heading>
            <Text fontSize="sm" color="brand.textMuted">
              {t("audit.table.subtitle")}
            </Text>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="brand.goldSoft">
                  <Tr>
                    <Th>{t("audit.table.headers.reference")}</Th>
                    <Th>{t("audit.table.headers.actor")}</Th>
                    <Th>{t("audit.table.headers.action")}</Th>
                    <Th>{t("audit.table.headers.entity")}</Th>
                    <Th>{t("audit.table.headers.timestamp")}</Th>
                    <Th>{t("audit.table.headers.severity")}</Th>
                    <Th>{t("audit.table.headers.ipAddress")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {records.map((record) => (
                    <Tr key={record.id} _hover={{ bg: "brand.goldSoft" }}>
                      <Td fontWeight="semibold" color="brand.deepGreen">
                        {record.id}
                      </Td>
                      <Td>{record.actor}</Td>
                      <Td>{record.action}</Td>
                      <Td>{record.entity}</Td>
                      <Td>{new Date(record.timestamp).toLocaleString("fr-FR")}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            record.severity === "info"
                              ? "green"
                              : record.severity === "warning"
                              ? "yellow"
                              : "red"
                          }
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {t(`audit.severity.${record.severity}`)}
                        </Badge>
                      </Td>
                      <Td>{record.ipAddress}</Td>
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

export default AuditLogPage;