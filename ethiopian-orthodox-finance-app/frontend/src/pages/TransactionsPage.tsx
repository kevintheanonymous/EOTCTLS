import {
  Badge,
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
  Input,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PiArrowDownBold, PiArrowUpBold, PiDownloadSimpleBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type TransactionRecord = {
  id: string;
  date: string;
  ledger: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  author: string;
  status: "cleared" | "pending" | "flagged";
};

const TransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    search: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchTransactions = async () => {
      try {
        const response = await apiClient.get<TransactionRecord[]>("/transactions");
        if (isMounted) {
          setTransactions(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setTransactions([
            {
              id: "TX-2025-001",
              date: "2025-09-14",
              ledger: t("transactions.sample.ledger").toString(),
              amount: 1800,
              type: "income",
              category: t("transactions.sample.category.tithe").toString(),
              author: "Abba Yohannes",
              status: "cleared",
            },
            {
              id: "TX-2025-002",
              date: "2025-09-18",
              ledger: t("transactions.sample.ledger").toString(),
              amount: 620,
              type: "expense",
              category: t("transactions.sample.category.outreach").toString(),
              author: "Mariam Bekele",
              status: "pending",
            },
            {
              id: "TX-2025-003",
              date: "2025-09-21",
              ledger: t("transactions.sample.ledger").toString(),
              amount: 340,
              type: "expense",
              category: t("transactions.sample.category.maintenance").toString(),
              author: "Tesfaye Habte",
              status: "flagged",
            },
          ]);
        }
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, [t]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = filters.type === "all" || tx.type === filters.type;
      const matchesCategory = filters.category === "all" || tx.category === filters.category;
      const matchesSearch =
        filters.search.trim().length === 0 ||
        tx.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        tx.author.toLowerCase().includes(filters.search.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [transactions, filters]);

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handleExport = async () => {
    try {
      await apiClient.get("/transactions/export", { responseType: "blob" });
      toast({
        title: t("transactions.export.successTitle"),
        description: t("transactions.export.successMessage"),
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("transactions.export.errorTitle"),
        description: t("transactions.export.errorMessage"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }} gap={4}>
          <Stack spacing={2}>
            <Heading size="2xl" color="brand.deepGreen">
              {t("transactions.title")}
            </Heading>
            <Text color="brand.textMuted">{t("transactions.subtitle")}</Text>
          </Stack>
          <Button
            colorScheme="brandGold"
            bg="brand.gold"
            color="brand.deepGreen"
            leftIcon={<PiDownloadSimpleBold />}
            _hover={{ bg: "brand.goldBright" }}
            onClick={handleExport}
          >
            {t("transactions.actions.exportCsv")}
          </Button>
        </Flex>

        <Card borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg" bg="white">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("transactions.filters.title")}
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={5}>
              <GridItem>
                <FormControl>
                  <FormLabel color="brand.deepGreen">{t("transactions.filters.typeLabel")}</FormLabel>
                  <Select
                    value={filters.type}
                    onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                  >
                    <option value="all">{t("transactions.filters.typeAll")}</option>
                    <option value="income">{t("transactions.filters.typeIncome")}</option>
                    <option value="expense">{t("transactions.filters.typeExpense")}</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel color="brand.deepGreen">{t("transactions.filters.categoryLabel")}</FormLabel>
                  <Select
                    value={filters.category}
                    onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                  >
                    <option value="all">{t("transactions.filters.categoryAll")}</option>
                    {[...new Set(transactions.map((tx) => tx.category))].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl>
                  <FormLabel color="brand.deepGreen">{t("transactions.filters.searchLabel")}</FormLabel>
                  <Input
                    value={filters.search}
                    onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                    placeholder={t("transactions.filters.searchPlaceholder") ?? ""}
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
          <Card borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md" bg="white">
            <CardBody>
              <Flex justify="space-between" align="center">
                <Stack spacing={1}>
                  <Text textTransform="uppercase" letterSpacing="widest" fontSize="sm" color="brand.textMuted">
                    {t("transactions.summary.totalIncome")}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.deepGreen">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalIncome)}
                  </Text>
                </Stack>
                <PiArrowUpBold size={32} color="#0A5E3E" />
              </Flex>
            </CardBody>
          </Card>
          <Card borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md" bg="white">
            <CardBody>
              <Flex justify="space-between" align="center">
                <Stack spacing={1}>
                  <Text textTransform="uppercase" letterSpacing="widest" fontSize="sm" color="brand.textMuted">
                    {t("transactions.summary.totalExpenses")}
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.deepGreen">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(totalExpenses)}
                  </Text>
                </Stack>
                <PiArrowDownBold size={32} color="#A4252E" />
              </Flex>
            </CardBody>
          </Card>
        </Grid>

        <Card borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="xl" bg="white">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("transactions.table.title")}
            </Heading>
            <Text fontSize="sm" color="brand.textMuted">
              {t("transactions.table.subtitle", { count: filteredTransactions.length })}
            </Text>
          </CardHeader>
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="brand.goldSoft">
                  <Tr>
                    <Th>{t("transactions.table.headers.reference")}</Th>
                    <Th>{t("transactions.table.headers.date")}</Th>
                    <Th>{t("transactions.table.headers.ledger")}</Th>
                    <Th isNumeric>{t("transactions.table.headers.amount")}</Th>
                    <Th>{t("transactions.table.headers.category")}</Th>
                    <Th>{t("transactions.table.headers.author")}</Th>
                    <Th>{t("transactions.table.headers.status")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredTransactions.map((tx) => (
                    <Tr key={tx.id} _hover={{ bg: "brand.goldSoft" }}>
                      <Td>{tx.id}</Td>
                      <Td>{new Date(tx.date).toLocaleDateString("fr-FR")}</Td>
                      <Td>{tx.ledger}</Td>
                      <Td isNumeric color={tx.type === "income" ? "brand.greenDeep" : "brand.deepRed"} fontWeight="semibold">
                        {tx.type === "income" ? "+" : "-"}
                        {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(tx.amount)}
                      </Td>
                      <Td>
                        <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                          {tx.category}
                        </Badge>
                      </Td>
                      <Td>{tx.author}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            tx.status === "cleared" ? "green" : tx.status === "pending" ? "yellow" : "red"
                          }
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {t(`transactions.status.${tx.status}`)}
                        </Badge>
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

export default TransactionsPage;