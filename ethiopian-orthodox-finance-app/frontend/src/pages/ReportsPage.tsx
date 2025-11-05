import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
  import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { PiFilePdfBold, PiFileTextBold, PiPrinterBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type ReportFilters = {
  timeRange: "quarter" | "year";
  fund: string;
  reportType: "summary" | "detailed";
};

type IncomeExpenseSeries = { period: string; income: number; expense: number };
type FundBalanceSeries = { period: string; balance: number };

type ReportsResponse = {
  incomeExpense: IncomeExpenseSeries[];
  fundBalances: FundBalanceSeries[];
};

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [filters, setFilters] = useState<ReportFilters>({
    timeRange: "quarter",
    fund: "all",
    reportType: "summary",
  });
  const [data, setData] = useState<ReportsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ReportsResponse>("/reports/overview", {
          params: filters,
        });
        if (isMounted) {
          setData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setData({
            incomeExpense: [
              { period: t("reports.sample.periods.q1"), income: 42000, expense: 21000 },
              { period: t("reports.sample.periods.q2"), income: 44800, expense: 23600 },
              { period: t("reports.sample.periods.q3"), income: 46150, expense: 22900 },
              { period: t("reports.sample.periods.q4"), income: 47800, expense: 24450 },
            ],
            fundBalances: [
              { period: t("reports.sample.periods.jan"), balance: 18200 },
              { period: t("reports.sample.periods.feb"), balance: 19150 },
              { period: t("reports.sample.periods.mar"), balance: 20180 },
              { period: t("reports.sample.periods.apr"), balance: 21400 },
              { period: t("reports.sample.periods.may"), balance: 22650 },
              { period: t("reports.sample.periods.jun"), balance: 23940 },
            ],
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchReports();
    return () => {
      isMounted = false;
    };
  }, [filters, t]);

  const handleDownload = async (format: "pdf" | "xlsx" | "print") => {
    try {
      if (format === "print") {
        window.print();
        return;
      }
      await apiClient.get(`/reports/export/${format}`, { params: filters, responseType: "blob" });
      toast({
        title: t("reports.export.successTitle"),
        description: t("reports.export.successMessage", { format: format.toUpperCase() }),
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("reports.export.errorTitle"),
        description: t("reports.export.errorMessage"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const totals = useMemo(() => {
    if (!data) return { income: 0, expense: 0, balance: 0 };
    const income = data.incomeExpense.reduce((sum, item) => sum + item.income, 0);
    const expense = data.incomeExpense.reduce((sum, item) => sum + item.expense, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [data]);

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Stack spacing={2}>
          <Heading size="2xl" color="brand.deepGreen">
            {t("reports.title")}
          </Heading>
          <Text color="brand.textMuted">{t("reports.subtitle")}</Text>
        </Stack>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("reports.filters.title")}
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              <FormControl>
                <FormLabel color="brand.deepGreen">{t("reports.filters.timeRange")}</FormLabel>
                <Select
                  value={filters.timeRange}
                  onChange={(event) => setFilters((prev) => ({ ...prev, timeRange: event.target.value as ReportFilters["timeRange"] }))}
                  borderColor="brand.goldSoft"
                  focusBorderColor="brand.gold"
                >
                  <option value="quarter">{t("reports.filters.timeRanges.quarter")}</option>
                  <option value="year">{t("reports.filters.timeRanges.year")}</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="brand.deepGreen">{t("reports.filters.fund")}</FormLabel>
                <Select
                  value={filters.fund}
                  onChange={(event) => setFilters((prev) => ({ ...prev, fund: event.target.value }))}
                  borderColor="brand.goldSoft"
                  focusBorderColor="brand.gold"
                >
                  <option value="all">{t("reports.filters.funds.all")}</option>
                  <option value="charity">{t("reports.filters.funds.charity")}</option>
                  <option value="building">{t("reports.filters.funds.building")}</option>
                  <option value="youth">{t("reports.filters.funds.youth")}</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="brand.deepGreen">{t("reports.filters.reportType")}</FormLabel>
                <Select
                  value={filters.reportType}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, reportType: event.target.value as ReportFilters["reportType"] }))
                  }
                  borderColor="brand.goldSoft"
                  focusBorderColor="brand.gold"
                >
                  <option value="summary">{t("reports.filters.reportTypes.summary")}</option>
                  <option value="detailed">{t("reports.filters.reportTypes.detailed")}</option>
                </Select>
              </FormControl>
            </Grid>
          </CardBody>
        </Card>

        <Grid templateColumns={{ base: "1fr", xl: "repeat(3, 1fr)" }} gap={6}>
          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md">
            <CardBody>
              <Stack spacing={1}>
                <Text fontSize="sm" textTransform="uppercase" color="brand.textMuted" letterSpacing="widest">
                  {t("reports.summary.totalIncome")}
                </Text>
                <Heading size="lg" color="brand.deepGreen">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totals.income)}
                </Heading>
              </Stack>
            </CardBody>
          </Card>
          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md">
            <CardBody>
              <Stack spacing={1}>
                <Text fontSize="sm" textTransform="uppercase" color="brand.textMuted" letterSpacing="widest">
                  {t("reports.summary.totalExpense")}
                </Text>
                <Heading size="lg" color="brand.deepGreen">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totals.expense)}
                </Heading>
              </Stack>
            </CardBody>
          </Card>
          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md">
            <CardBody>
              <Stack spacing={1}>
                <Text fontSize="sm" textTransform="uppercase" color="brand.textMuted" letterSpacing="widest">
                  {t("reports.summary.netBalance")}
                </Text>
                <Heading size="lg" color={totals.balance >= 0 ? "brand.greenDeep" : "brand.deepRed"}>
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totals.balance)}
                </Heading>
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Grid templateColumns={{ base: "1fr", xl: "repeat(2, 1fr)" }} gap={6}>
          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
            <CardHeader>
              <Heading size="md" color="brand.deepGreen">
                {t("reports.charts.incomeExpense.title")}
              </Heading>
              <Text fontSize="sm" color="brand.textMuted">
                {t("reports.charts.incomeExpense.subtitle")}
              </Text>
            </CardHeader>
            <CardBody>
              <Box height={{ base: "260px", md: "320px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.incomeExpense ?? []} barSize={24}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#D7C8A2" />
                    <XAxis dataKey="period" stroke="#5F7064" />
                    <YAxis stroke="#5F7064" />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)
                      }
                    />
                    <Bar dataKey="income" fill="#0A5E3E" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" fill="#A4252E" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
            <CardHeader>
              <Heading size="md" color="brand.deepGreen">
                {t("reports.charts.fundBalance.title")}
              </Heading>
              <Text fontSize="sm" color="brand.textMuted">
                {t("reports.charts.fundBalance.subtitle")}
              </Text>
            </CardHeader>
            <CardBody>
              <Box height={{ base: "260px", md: "320px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.fundBalances ?? []}>
                    <defs>
                      <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E6B422" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#E6B422" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="period" stroke="#5F7064" />
                    <YAxis stroke="#5F7064" />
                    <CartesianGrid strokeDasharray="4 4" stroke="#D7C8A2" />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)
                      }
                    />
                    <Area type="monotone" dataKey="balance" stroke="#E6B422" fill="url(#balanceGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </Grid>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("reports.export.title")}
            </Heading>
            <Text fontSize="sm" color="brand.textMuted">
              {t("reports.export.subtitle")}
            </Text>
          </CardHeader>
          <CardBody>
            <Flex wrap="wrap" gap={4}>
              <Button
                leftIcon={<PiFilePdfBold />}
                colorScheme="brandRed"
                bg="brand.deepRed"
                color="white"
                _hover={{ bg: "rgba(164,37,46,0.85)" }}
                onClick={() => handleDownload("pdf")}
                isLoading={isLoading}
              >
                {t("reports.export.pdf")}
              </Button>
              <Button
                leftIcon={<PiFileTextBold />}
                colorScheme="brandGold"
                bg="brand.gold"
                color="brand.deepGreen"
                _hover={{ bg: "brand.goldBright" }}
                onClick={() => handleDownload("xlsx")}
                isLoading={isLoading}
              >
                {t("reports.export.xlsx")}
              </Button>
              <Button
                leftIcon={<PiPrinterBold />}
                variant="outline"
                colorScheme="brandGreen"
                borderColor="brand.green"
                color="brand.deepGreen"
                _hover={{ bg: "brand.goldSoft" }}
                onClick={() => handleDownload("print")}
              >
                {t("reports.export.print")}
              </Button>
            </Flex>
          </CardBody>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <Text fontSize="sm" color="brand.textMuted">
              {t("reports.disclaimer")}
            </Text>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};

export default ReportsPage;