import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { PiCoinsBold, PiHandHeartBold, PiNotebookBold, PiUsersThreeBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type MetricCard = {
  label: string;
  value: number | string;
  delta?: number;
  icon: React.ComponentType;
  tone: "green" | "gold" | "red";
};

type DashboardResponse = {
  totals: {
    members: number;
    activeFunds: number;
    monthlyGiving: number;
    commitments: number;
  };
  monthlyTrend: Array<{ month: string; income: number; expenses: number }>;
  categorySplit: Array<{ name: string; value: number }>;
  recentHighlights: Array<{ title: string; detail: string; status: "success" | "info" | "warning" }>;
};

const pieColors = ["#A4252E", "#E6B422", "#0A5E3E", "#F5D87C"];

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get<DashboardResponse>("/dashboard/overview");
        if (isMounted) {
          setData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setData({
            totals: {
              members: 352,
              activeFunds: 12,
              monthlyGiving: 18750,
              commitments: 54000,
            },
            monthlyTrend: [
              { month: t("common.months.short.jan"), income: 14800, expenses: 6200 },
              { month: t("common.months.short.feb"), income: 15600, expenses: 7100 },
              { month: t("common.months.short.mar"), income: 16550, expenses: 8050 },
              { month: t("common.months.short.apr"), income: 17200, expenses: 8800 },
              { month: t("common.months.short.may"), income: 18100, expenses: 9400 },
              { month: t("common.months.short.jun"), income: 18750, expenses: 9900 },
            ],
            categorySplit: [
              { name: t("dashboard.categorySplit.liturgy"), value: 34 },
              { name: t("dashboard.categorySplit.charity"), value: 28 },
              { name: t("dashboard.categorySplit.development"), value: 22 },
              { name: t("dashboard.categorySplit.operations"), value: 16 },
            ],
            recentHighlights: [
              {
                title: t("dashboard.highlights.auditCompleted.title"),
                detail: t("dashboard.highlights.auditCompleted.detail"),
                status: "success",
              },
              {
                title: t("dashboard.highlights.charityDrive.title"),
                detail: t("dashboard.highlights.charityDrive.detail"),
                status: "info",
              },
              {
                title: t("dashboard.highlights.maintenance.title"),
                detail: t("dashboard.highlights.maintenance.detail"),
                status: "warning",
              },
            ],
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [t]);

  const metricCards: MetricCard[] = useMemo(
    () => [
      {
        label: t("dashboard.metrics.members"),
        value: data?.totals.members ?? 0,
        delta: 6.4,
        icon: PiUsersThreeBold,
        tone: "green",
      },
      {
        label: t("dashboard.metrics.monthlyGiving"),
        value: data ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(data.totals.monthlyGiving) : "€0",
        delta: 4.2,
        icon: PiCoinsBold,
        tone: "gold",
      },
      {
        label: t("dashboard.metrics.activeFunds"),
        value: data?.totals.activeFunds ?? 0,
        icon: PiNotebookBold,
        tone: "gold",
      },
      {
        label: t("dashboard.metrics.commitments"),
        value: data ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(data.totals.commitments) : "€0",
        icon: PiHandHeartBold,
        tone: "red",
      },
    ],
    [data, t],
  );

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Stack spacing={2}>
          <Heading size="2xl" color="brand.deepGreen">
            {t("dashboard.title")}
          </Heading>
          <Text color="brand.textMuted">{t("dashboard.subtitle")}</Text>
        </Stack>

        {isLoading ? (
          <Flex align="center" justify="center" minH="280px" bg="white" borderRadius="2xl" shadow="lg">
            <Spinner size="xl" color="brand.deepRed" />
          </Flex>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={6}>
              {metricCards.map((card) => (
                <Card key={card.label} bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
                  <CardBody>
                    <Stack spacing={5}>
                      <Flex align="center" justify="space-between">
                        <Stack spacing={1}>
                          <Text fontSize="sm" textTransform="uppercase" color="brand.textMuted" letterSpacing="widest">
                            {card.label}
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold" color="brand.deepGreen">
                            {card.value}
                          </Text>
                        </Stack>
                        <Flex
                          align="center"
                          justify="center"
                          boxSize="56px"
                          borderRadius="full"
                          bg={card.tone === "green" ? "brand.greenSoft" : card.tone === "gold" ? "brand.goldSoft" : "rgba(164,37,46,0.12)"}
                          color={card.tone === "green" ? "brand.greenDeep" : card.tone === "gold" ? "brand.deepGreen" : "brand.deepRed"}
                        >
                          <Icon as={card.icon} boxSize="28px" />
                        </Flex>
                      </Flex>
                      {card.delta !== undefined && (
                        <Badge
                          colorScheme={card.delta >= 0 ? "green" : "red"}
                          alignSelf="flex-start"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {card.delta >= 0 ? "+" : ""}
                          {card.delta}%
                        </Badge>
                      )}
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap={6}>
              <GridItem>
                <Card bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
                  <CardHeader>
                    <Heading size="md" color="brand.deepGreen">
                      {t("dashboard.charts.monthlyTrend.title")}
                    </Heading>
                    <Text fontSize="sm" color="brand.textMuted">
                      {t("dashboard.charts.monthlyTrend.subtitle")}
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Box height={{ base: "260px", md: "320px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data?.monthlyTrend ?? []}>
                          <XAxis dataKey="month" stroke="#5F7064" />
                          <YAxis stroke="#5F7064" />
                          <Tooltip
                            formatter={(value: number) =>
                              new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)
                            }
                          />
                          <Legend />
                          <Line type="monotone" dataKey="income" stroke="#0A5E3E" strokeWidth={3} dot={{ r: 4 }} />
                          <Line type="monotone" dataKey="expenses" stroke="#A4252E" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem>
                <Card bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
                  <CardHeader>
                    <Heading size="md" color="brand.deepGreen">
                      {t("dashboard.charts.categorySplit.title")}
                    </Heading>
                    <Text fontSize="sm" color="brand.textMuted">
                      {t("dashboard.charts.categorySplit.subtitle")}
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <Box height={{ base: "260px", md: "320px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data?.categorySplit ?? []}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={6}
                          >
                            {(data?.categorySplit ?? []).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(value: number) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

            <Card bg={cardBg} borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
              <CardHeader>
                <Heading size="md" color="brand.deepGreen">
                  {t("dashboard.highlights.title")}
                </Heading>
                <Text fontSize="sm" color="brand.textMuted">
                  {t("dashboard.highlights.subtitle")}
                </Text>
              </CardHeader>
              <CardBody>
                <Stack spacing={5}>
                  {(data?.recentHighlights ?? []).map((highlight) => (
                    <Flex
                      key={highlight.title}
                      direction={{ base: "column", md: "row" }}
                      justify="space-between"
                      bg="brand.goldSoft"
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="brand.gold"
                      p={5}
                      gap={3}
                    >
                      <Stack spacing={1}>
                        <Text fontWeight="bold" color="brand.deepGreen">
                          {highlight.title}
                        </Text>
                        <Text color="brand.textMuted">{highlight.detail}</Text>
                      </Stack>
                      <Badge
                        alignSelf={{ base: "flex-start", md: "center" }}
                        colorScheme={
                          highlight.status === "success" ? "green" : highlight.status === "info" ? "blue" : "yellow"
                        }
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {t(`dashboard.highlights.status.${highlight.status}`)}
                      </Badge>
                    </Flex>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default DashboardPage;