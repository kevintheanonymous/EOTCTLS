import {
  Box,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { PiHandsPrayingBold, PiHeartbeatBold, PiSealCheckBold } from "react-icons/pi";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box as="main" bg="brand.beige" color="brand.deepGreen" minH="100vh" py={{ base: 10, md: 16 }}>
      <Container maxW="7xl">
        <Stack spacing={{ base: 10, md: 16 }}>
          <Flex
            direction={{ base: "column", lg: "row" }}
            bg="white"
            borderRadius="2xl"
            shadow="xl"
            overflow="hidden"
          >
            <Box flex="1" p={{ base: 8, md: 12 }}>
              <Stack spacing={6}>
                <Text fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="brand.deepRed">
                  {t("about.hero.kicker")}
                </Text>
                <Heading size="2xl" color="brand.deepGreen">
                  {t("about.hero.title")}
                </Heading>
                <Text fontSize={{ base: "md", md: "lg" }} color="brand.textMuted">
                  {t("about.hero.description")}
                </Text>
              </Stack>
            </Box>
            <Box flex="1" position="relative">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Eglise_Saint-Aubin_de_Toulouse.jpg/640px-Eglise_Saint-Aubin_de_Toulouse.jpg"
                alt={t("about.hero.imageAlt")}
                objectFit="cover"
                w="100%"
                h="100%"
              />
              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-br, rgba(164,37,46,0.4), rgba(230,180,34,0.25))"
              />
            </Box>
          </Flex>

          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={{ base: 8, md: 10 }}>
            {[
              {
                icon: PiHandsPrayingBold,
                title: t("about.values.faith.title"),
                description: t("about.values.faith.description"),
              },
              {
                icon: PiHeartbeatBold,
                title: t("about.values.service.title"),
                description: t("about.values.service.description"),
              },
              {
                icon: PiSealCheckBold,
                title: t("about.values.integrity.title"),
                description: t("about.values.integrity.description"),
              },
            ].map((item) => (
              <GridItem
                key={item.title}
                bg="white"
                borderRadius="xl"
                border="1px solid"
                borderColor="brand.goldSoft"
                p={8}
                shadow="md"
              >
                <Stack spacing={4} align="flex-start">
                  <Flex
                    align="center"
                    justify="center"
                    boxSize="56px"
                    borderRadius="full"
                    bg="brand.goldSoft"
                    color="brand.deepRed"
                  >
                    <Icon as={item.icon} boxSize={7} />
                  </Flex>
                  <Heading size="md">{item.title}</Heading>
                  <Text color="brand.textMuted">{item.description}</Text>
                </Stack>
              </GridItem>
            ))}
          </Grid>

          <Flex
            direction={{ base: "column", lg: "row" }}
            bg="brand.deepGreen"
            color="white"
            borderRadius="2xl"
            overflow="hidden"
          >
            <Box flex="1" p={{ base: 8, md: 12 }}>
              <Stack spacing={6}>
                <Heading size="lg" color="brand.gold">
                  {t("about.history.title")}
                </Heading>
                <Text color="whiteAlpha.900">{t("about.history.sectionOne")}</Text>
                <Text color="whiteAlpha.900">{t("about.history.sectionTwo")}</Text>
                <Text color="whiteAlpha.900">{t("about.history.sectionThree")}</Text>
              </Stack>
            </Box>
            <Box flex="1" position="relative">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Bete_Giyorgis_Lalibela.jpg/640px-Bete_Giyorgis_Lalibela.jpg"
                alt={t("about.history.imageAlt")}
                objectFit="cover"
                w="100%"
                h="100%"
              />
              <Box position="absolute" inset={0} bg="rgba(16, 40, 28, 0.45)" />
            </Box>
          </Flex>

          <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" p={{ base: 8, md: 12 }}>
            <Stack spacing={6}>
              <Heading size="lg" color="brand.deepGreen">
                {t("about.commitment.title")}
              </Heading>
              <Text fontSize="md" color="brand.textMuted">
                {t("about.commitment.intro")}
              </Text>
              <Wrap spacing={6}>
                {[
                  t("about.commitment.points.stewardship"),
                  t("about.commitment.points.transparency"),
                  t("about.commitment.points.community"),
                  t("about.commitment.points.future"),
                  t("about.commitment.points.education"),
                  t("about.commitment.points.partnerships"),
                ].map((point) => (
                  <WrapItem
                    key={point}
                    px={5}
                    py={3}
                    borderRadius="xl"
                    bg="brand.goldSoft"
                    color="brand.deepGreen"
                    fontWeight="semibold"
                    border="1px solid"
                    borderColor="brand.gold"
                  >
                    {point}
                  </WrapItem>
                ))}
              </Wrap>
            </Stack>
          </Box>

          <Box bg="brand.goldSoft" borderRadius="2xl" p={{ base: 8, md: 12 }} border="1px solid" borderColor="brand.gold">
            <Stack spacing={6}>
              <Heading size="lg" color="brand.deepGreen">
                {t("about.team.title")}
              </Heading>
              <Text color="brand.deepGreen">{t("about.team.description")}</Text>
              <Divider borderColor="brand.gold" />
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                {t("about.team.members", { returnObjects: true })?.map(
                  (member: { name: string; role: string; bio: string; avatar: string }) => (
                    <GridItem
                      key={member.name}
                      bg="white"
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="brand.goldSoft"
                      p={6}
                      shadow="sm"
                    >
                      <Flex align="center" gap={4}>
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          borderRadius="full"
                          boxSize="64px"
                          objectFit="cover"
                        />
                        <Stack spacing={1}>
                          <Text fontWeight="bold" color="brand.deepGreen">
                            {member.name}
                          </Text>
                          <Text fontSize="sm" color="brand.deepRed">
                            {member.role}
                          </Text>
                        </Stack>
                      </Flex>
                      <Text mt={4} fontSize="sm" color="brand.textMuted">
                        {member.bio}
                      </Text>
                    </GridItem>
                  ),
                )}
              </Grid>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default AboutPage;