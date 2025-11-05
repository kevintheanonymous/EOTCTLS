import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Progress,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from "recharts";
import { PiCurrencyCircleDollarBold, PiNotebookBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type FundRecord = {
  id: string;
  name: string;
  manager: string;
  goal: number;
  balance: number;
  expensesToDate: number;
  nextMilestone: string;
};

type RadarDatum = {
  area: string;
  allocation: number;
};

const FundsPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [funds, setFunds] = useState<FundRecord[]>([]);
  const [radarData, setRadarData] = useState<RadarDatum[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchFunds = async () => {
      try {
        const response = await apiClient.get<{ funds: FundRecord[]; radar: RadarDatum[] }>("/funds");
        if (isMounted) {
          setFunds(response.data.funds);
          setRadarData(response.data.radar);
        }
      } catch (error) {
        if (isMounted) {
          const sampleFunds: FundRecord[] = [
            {
              id: "FND-001",
              name: t("funds.sample.names.charity").toString(),
              manager: "Selam Abebe",
              goal: 35000,
              balance: 21800,
              expensesToDate: 9400,
              nextMilestone: t("funds.sample.milestones.charity").toString(),
            },
            {
              id: "FND-002",
              name: t("funds.sample.names.building").toString(),
              manager: "Hanna Kidan",
              goal: 60000,
              balance: 44250,
              expensesToDate: 16800,
              nextMilestone: t("funds.sample.milestones.building").toString(),
            },
            {
              id: "FND-003",
              name: t("funds.sample.names.youth").toString(),
              manager: "Mikiyas Desta",
              goal: 15000,
              balance: 9200,
              expensesToDate: 5200,
              nextMilestone: t("funds.sample.milestones.youth").toString(),
            },
          ];
          setFunds(sampleFunds);
          setRadarData([
            { area: t("funds.sample.areas.outreach").toString(), allocation: 82 },
            { area: t("funds.sample.areas.education").toString(), allocation: 65 },
            { area: t("funds.sample.areas.liturgy").toString(), allocation: 74 },
            { area: t("funds.sample.areas.development").toString(), allocation: 58 },
            { area: t("funds.sample.areas.operations").toString(), allocation: 49 },
          ]);
          toast({
            title: t("funds.notifications.sampleLoaded"),
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };

    fetchFunds();
    return () => {
      isMounted = false;
    };
  }, [t, toast]);

  const totals = useMemo(() => {
    if (funds.length === 0) return { goal: 0, balance: 0, expenses: 0 };
    return funds.reduce(
      (acc, fund) => ({
        goal: acc.goal + fund.goal,
        balance: acc.balance + fund.balance,
        expenses: acc.expenses + fund.expensesToDate,
      }),
      { goal: 0, balance: 0, expenses: 0 },
    );
  }, [funds]);

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Stack spacing={2}>
          <Heading size="2xl" color="brand.deepGreen">
            {t("funds.title")}
          </Heading>
            <Text color="brand.textMuted">{t("funds.subtitle")}</Text>
        </Stack>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={6}>
          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md">
            <CardBody>
              <Stack spacing={1}>
                <Text fontSize="sm" textTransform="uppercase" color="brand.textMuted" letterSpacing="widest">
                  {t("funds.summary.totalGoal")}
                </Text>
                <Heading size="lg" color="brand.deepGreen">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totals.goal)}
                </Heading>
              </Stack>
            </CardBody>
          </Card>
          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md">
            <CardBody>
              <Stack spacing={1}>
                <Text fontSize="sm" textTransform="uppercase" color="brand.textMuted" letterSpacing="widest">
                  {t("funds.summary.currentBalance")}
                </Text>
                <Heading size="lg" color="brand.greenDeep">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totals.balance)}
                </Heading>
              </Stack>
            </CardBody>
          </Card>
          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md">
            <CardBody>
              <Stack spacing={1}>
                <Text fontSize="sm" textTransform="uppercase" color="brand.textMuted" letterSpacing="widest">
                  {t("funds.summary.expensesToDate")}
                </Text>
                <Heading size="lg" color="brand.deepRed">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totals.expenses)}
                </Heading>
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Grid templateColumns={{ base: "1fr", xl: "2fr 1fr" }} gap={6}>
          <GridItem>
            <Stack spacing={6}>
              {funds.map((fund) => {
                const progress = Math.min((fund.balance / fund.goal) * 100, 100);
                return (
                  <Card key={fund.id} bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Stack spacing={1}>
                          <Heading size="md" color="brand.deepGreen">
                            {fund.name}
                          </Heading>
                          <Text fontSize="sm" color="brand.textMuted">
                            {t("funds.labels.managedBy", { manager: fund.manager })}
                          </Text>
                        </Stack>
                        <Button
                          as="a"
                          href={`/funds/${fund.id}`}
                          size="sm"
                          colorScheme="brandGreen"
                          bg="brand.green"
                          color="white"
                          _hover={{ bg: "brand.greenDeep" }}
                        >
                          {t("funds.actions.viewDetails")}
                        </Button>
                      </Flex>
                    </CardHeader>
                    <Divider borderColor="brand.goldSoft" />
                    <CardBody>
                      <Stack spacing={4}>
                        <Flex justify="space-between" align="center">
                          <Stack spacing={1}>
                            <Text fontSize="sm" color="brand.textMuted">
                              {t("funds.labels.balance")}
                            </Text>
                            <Heading size="lg" color="brand.greenDeep">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(fund.balance)}
                            </Heading>
                          </Stack>
                          <Stack spacing={1} textAlign="right">
                            <Text fontSize="sm" color="brand.textMuted">
                              {t("funds.labels.goal")}
                            </Text>
                            <Text fontWeight="semibold" color="brand.deepGreen">
                              {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(fund.goal)}
                            </Text>
                          </Stack>
                        </Flex>
                        <Progress value={progress} colorScheme="brandGold" borderRadius="md" height="10px" />
                        <Flex justify="space-between" align="center">
                          <Text fontSize="sm" color="brand.textMuted">
                            {t("funds.labels.expenses", {
                              amount: new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(fund.expensesToDate),
                            })}
                          </Text>
                          <Text fontSize="sm" color="brand.deepRed">
                            {t("funds.labels.nextMilestone", { milestone: fund.nextMilestone })}
                          </Text>
                        </Flex>
                      </Stack>
                    </CardBody>
                  </Card>
                );
              })}
            </Stack>
          </GridItem>

          <GridItem>
            <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
              <CardHeader>
                <Flex align="center" gap={3}>
                  <PiNotebookBold size={28} color="#A4252E" />
                  <Stack spacing={1}>
                    <Heading size="md" color="brand.deepGreen">
                      {t("funds.charts.allocation.title")}
                    </Heading>
                    <Text fontSize="sm" color="brand.textMuted">
                      {t("funds.charts.allocation.subtitle")}
                    </Text>
                  </Stack>
                </Flex>
              </CardHeader>
              <Divider borderColor="brand.goldSoft" />
              <CardBody>
                <Box height={{ base: "260px", md: "320px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#D7C8A2" />
                      <PolarAngleAxis dataKey="area" stroke="#5F7064" />
                      <Tooltip />
                      <Radar dataKey="allocation" stroke="#E6B422" fill="#E6B422" fillOpacity={0.45} />
                    </RadarChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md">
          <CardHeader>
            <Flex align="center" gap={3}>
              <PiCurrencyCircleDollarBold size={28} color="#0A5E3E" />
              <Stack spacing={1}>
                <Heading size="md" color="brand.deepGreen">
                  {t("funds.guidelines.title")}
                </Heading>
                <Text fontSize="sm" color="brand.textMuted">
                  {t("funds.guidelines.subtitle")}
                </Text>
              </Stack>
            </Flex>
          </CardHeader>
          <CardBody>
            <Stack spacing={3}>
              {t("funds.guidelines.items", { returnObjects: true })?.map((guideline: string) => (
                <Flex key={guideline} align="center" gap={3}>
                  <Box boxSize="8px" borderRadius="full" bg="brand.deepGreen" />
                  <Text color="brand.deepGreen">{guideline}</Text>
                </Flex>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};

export default FundsPage;