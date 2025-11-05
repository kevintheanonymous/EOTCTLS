import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
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
import { Link as RouterLink } from "react-router-dom";
import { PiDownloadSimpleBold, PiUserCircleBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type MemberRecord = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  status: "active" | "pending" | "inactive";
  email: string;
  phone: string;
  households: number;
};

const MembersPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { onOpen } = useDisclosure();
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    search: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      try {
        const response = await apiClient.get<MemberRecord[]>("/members");
        if (isMounted) setMembers(response.data);
      } catch (error) {
        if (isMounted)
          setMembers([
            {
              id: "MBR-001",
              firstName: "Kidane",
              lastName: "Hailemariam",
              role: t("members.sample.roles.treasurer").toString(),
              status: "active",
              email: "kidane.h@eotc-toulouse.fr",
              phone: "+33 6 12 34 56 78",
              households: 2,
            },
            {
              id: "MBR-002",
              firstName: "Saba",
              lastName: "Girma",
              role: t("members.sample.roles.volunteer").toString(),
              status: "pending",
              email: "saba.g@eotc-toulouse.fr",
              phone: "+33 6 98 76 54 32",
              households: 1,
            },
            {
              id: "MBR-003",
              firstName: "Abba",
              lastName: "Yared",
              role: t("members.sample.roles.priest").toString(),
              status: "active",
              email: "abba.y@eotc-toulouse.fr",
              phone: "+33 5 61 00 00 01",
              households: 3,
            },
          ]);
      }
    };

    fetchMembers();
    return () => {
      isMounted = false;
    };
  }, [t]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesRole = filters.role === "all" || member.role === filters.role;
      const matchesStatus = filters.status === "all" || member.status === filters.status;
      const matchesSearch =
        filters.search.trim().length === 0 ||
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
        member.email.toLowerCase().includes(filters.search.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [members, filters]);

  const handleExport = async () => {
    try {
      await apiClient.get("/members/export", { responseType: "blob" });
      toast({
        title: t("members.actions.exportSuccess"),
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("members.actions.exportError"),
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
              {t("members.title")}
            </Heading>
            <Text color="brand.textMuted">{t("members.subtitle", { count: filteredMembers.length })}</Text>
          </Stack>
          <Flex gap={3} wrap="wrap">
            <Button
              leftIcon={<PiDownloadSimpleBold />}
              colorScheme="brandGold"
              bg="brand.gold"
              color="brand.deepGreen"
              _hover={{ bg: "brand.goldBright" }}
              onClick={handleExport}
            >
              {t("members.actions.export")}
            </Button>
            <Button
              leftIcon={<PiUserCircleBold />}
              as={RouterLink}
              to="/members/new"
              colorScheme="brandGreen"
              bg="brand.green"
              color="white"
              _hover={{ bg: "brand.greenDeep" }}
              onClick={onOpen}
            >
              {t("members.actions.addMember")}
            </Button>
          </Flex>
        </Flex>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("members.filters.title")}
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              <FormControl>
                <FormLabel color="brand.deepGreen">{t("members.filters.role")}</FormLabel>
                <Select
                  borderColor="brand.goldSoft"
                  focusBorderColor="brand.gold"
                  value={filters.role}
                  onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value }))}
                >
                  <option value="all">{t("members.filters.allRoles")}</option>
                  {[...new Set(members.map((member) => member.role))].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="brand.deepGreen">{t("members.filters.status")}</FormLabel>
                <Select
                  borderColor="brand.goldSoft"
                  focusBorderColor="brand.gold"
                  value={filters.status}
                  onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value as MemberRecord["status"] | "all" }))}
                >
                  <option value="all">{t("members.filters.allStatuses")}</option>
                  <option value="active">{t("members.status.active")}</option>
                  <option value="pending">{t("members.status.pending")}</option>
                  <option value="inactive">{t("members.status.inactive")}</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel color="brand.deepGreen">{t("members.filters.search")}</FormLabel>
                <Input
                  placeholder={t("members.filters.searchPlaceholder") ?? ""}
                  borderColor="brand.goldSoft"
                  focusBorderColor="brand.gold"
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                />
              </FormControl>
            </Grid>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="xl">
          <CardBody>
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead bg="brand.goldSoft">
                  <Tr>
                    <Th>{t("members.table.headers.name")}</Th>
                    <Th>{t("members.table.headers.role")}</Th>
                    <Th>{t("members.table.headers.email")}</Th>
                    <Th>{t("members.table.headers.phone")}</Th>
                    <Th>{t("members.table.headers.households")}</Th>
                    <Th>{t("members.table.headers.status")}</Th>
                    <Th />
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredMembers.map((member) => (
                    <Tr key={member.id} _hover={{ bg: "brand.goldSoft" }}>
                      <Td fontWeight="semibold" color="brand.deepGreen">
                        {member.firstName} {member.lastName}
                      </Td>
                      <Td>{member.role}</Td>
                      <Td>{member.email}</Td>
                      <Td>{member.phone}</Td>
                      <Td>{member.households}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            member.status === "active" ? "green" : member.status === "pending" ? "yellow" : "gray"
                          }
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {t(`members.status.${member.status}`)}
                        </Badge>
                      </Td>
                      <Td>
                        <Button
                          as={RouterLink}
                          to={`/members/${member.id}`}
                          size="sm"
                          variant="outline"
                          colorScheme="brandGreen"
                          borderColor="brand.green"
                          color="brand.deepGreen"
                        >
                          {t("members.actions.viewProfile")}
                        </Button>
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

export default MembersPage;