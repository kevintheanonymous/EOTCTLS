import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PiChurchBold, PiCoinsBold, PiUserCircleGearBold } from "react-icons/pi";
import apiClient from "../services/apiClient";

type MemberProfile = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  status: "active" | "pending" | "inactive";
  email: string;
  phone: string;
  address: string;
  households: number;
  committees: string[];
  givingHistory: Array<{ period: string; amount: number }>;
  responsibilities: string[];
};

const MemberProfilePage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { t } = useTranslation();
  const toast = useToast();
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await apiClient.get<MemberProfile>(`/members/${memberId}`);
        if (isMounted) setProfile(response.data);
      } catch (error) {
        if (isMounted)
          setProfile({
            id: memberId ?? "MBR-001",
            firstName: "Kidane",
            lastName: "Hailemariam",
            role: t("members.sample.roles.treasurer").toString(),
            status: "active",
            email: "kidane.h@eotc-toulouse.fr",
            phone: "+33 6 12 34 56 78",
            address: "15 Rue de l'Église, 31000 Toulouse",
            households: 2,
            committees: [t("memberProfile.sample.committees.finance").toString(), t("memberProfile.sample.committees.outreach").toString()],
            givingHistory: [
              { period: t("memberProfile.sample.givingPeriods.q1").toString(), amount: 1800 },
              { period: t("memberProfile.sample.givingPeriods.q2").toString(), amount: 1950 },
              { period: t("memberProfile.sample.givingPeriods.q3").toString(), amount: 2100 },
            ],
            responsibilities: [
              t("memberProfile.sample.responsibilities.audit").toString(),
              t("memberProfile.sample.responsibilities.reporting").toString(),
            ],
          });
        toast({
          title: t("memberProfile.notifications.sampleLoaded"),
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [memberId, t, toast]);

  if (!profile) {
    return (
      <Box as="main" py={16} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
        <Text color="brand.textMuted">{t("memberProfile.loading")}</Text>
      </Box>
    );
  }

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="xl">
          <CardBody>
            <Flex direction={{ base: "column", md: "row" }} align={{ base: "flex-start", md: "center" }} gap={6}>
              <Avatar
                size="2xl"
                name={`${profile.firstName} ${profile.lastName}`}
                bg="brand.gold"
                color="brand.deepGreen"
              />
              <Stack spacing={2}>
                <Heading size="lg" color="brand.deepGreen">
                  {profile.firstName} {profile.lastName}
                </Heading>
                <Text color="brand.textMuted">{profile.role}</Text>
                <Flex align="center" gap={3} wrap="wrap">
                  <Badge colorScheme="green" borderRadius="full" px={3} py={1}>
                    {t(`members.status.${profile.status}`)}
                  </Badge>
                  <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                    {t("memberProfile.labels.households", { count: profile.households })}
                  </Badge>
                </Flex>
              </Stack>
            </Flex>
          </CardBody>
        </Card>

        <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
            <CardHeader>
              <Heading size="md" color="brand.deepGreen">
                {t("memberProfile.sections.contact.title")}
              </Heading>
            </CardHeader>
            <Divider borderColor="brand.goldSoft" />
            <CardBody>
              <Stack spacing={4}>
                <Flex align="center" gap={3}>
                  <Icon as={PiUserCircleGearBold} color="brand.deepRed" boxSize={6} />
                  <Stack spacing={0}>
                    <Text fontWeight="semibold" color="brand.deepGreen">
                      {t("memberProfile.sections.contact.email")}
                    </Text>
                    <Text color="brand.textMuted">{profile.email}</Text>
                  </Stack>
                </Flex>
                <Flex align="center" gap={3}>
                  <Icon as={PiCoinsBold} color="brand.deepRed" boxSize={6} />
                  <Stack spacing={0}>
                    <Text fontWeight="semibold" color="brand.deepGreen">
                      {t("memberProfile.sections.contact.phone")}
                    </Text>
                    <Text color="brand.textMuted">{profile.phone}</Text>
                  </Stack>
                </Flex>
                <Flex align="center" gap={3}>
                  <Icon as={PiChurchBold} color="brand.deepRed" boxSize={6} />
                  <Stack spacing={0}>
                    <Text fontWeight="semibold" color="brand.deepGreen">
                      {t("memberProfile.sections.contact.address")}
                    </Text>
                    <Text color="brand.textMuted">{profile.address}</Text>
                  </Stack>
                </Flex>
              </Stack>
            </CardBody>
          </Card>

          <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
            <CardHeader>
              <Heading size="md" color="brand.deepGreen">
                {t("memberProfile.sections.committees.title")}
              </Heading>
            </CardHeader>
            <Divider borderColor="brand.goldSoft" />
            <CardBody>
              <Stack spacing={3}>
                {profile.committees.map((committee) => (
                  <Badge key={committee} colorScheme="brand" borderRadius="xl" px={4} py={2} bg="brand.goldSoft" color="brand.deepGreen">
                    {committee}
                  </Badge>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("memberProfile.sections.giving.title")}
            </Heading>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
              {profile.givingHistory.map((entry) => (
                <GridItem key={entry.period} borderRadius="xl" border="1px solid" borderColor="brand.goldSoft" bg="brand.goldSoft" p={5}>
                  <Stack spacing={1}>
                    <Text fontSize="sm" textTransform="uppercase" color="brand.textMuted" letterSpacing="widest">
                      {entry.period}
                    </Text>
                    <Heading size="lg" color="brand.deepGreen">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(entry.amount)}
                    </Heading>
                  </Stack>
                </GridItem>
              ))}
            </Grid>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("memberProfile.sections.responsibilities.title")}
            </Heading>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <Stack spacing={4}>
              {profile.responsibilities.map((item) => (
                <Flex key={item} align="center" gap={3}>
                  <Box boxSize="12px" borderRadius="full" bg="brand.deepRed" />
                  <Text color="brand.deepGreen">{item}</Text>
                </Flex>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};

export default MemberProfilePage;