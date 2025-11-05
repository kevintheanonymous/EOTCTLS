import { Box, Button, Flex, Grid, GridItem, Heading, Icon, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PiChurchBold, PiShieldCheckBold, PiUsersThreeBold } from "react-icons/pi";

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const heroBg = useBreakpointValue({
    base: "linear-gradient(135deg, rgba(164,37,46,0.92), rgba(230,180,34,0.9))",
    md: "linear-gradient(120deg, rgba(164,37,46,0.94) 0%, rgba(230,180,34,0.85) 48%, rgba(10,94,62,0.85) 100%)",
  });

  return (
    <Box as="main" minH="100vh" bg="brand.beige" color="brand.deepGreen">
      <Box bgImage="url('https://upload.wikimedia.org/wikipedia/commons/3/38/Solomonic_cross.svg')" bgRepeat="no-repeat" bgSize="220px" bgPos="top right" opacity={0.08} position="absolute" inset={0} pointerEvents="none" />
      <Flex direction={{ base: "column", lg: "row" }} align="stretch" position="relative" zIndex={1}>
        <Flex flex="1" p={{ base: 8, md: 16 }} align="center" justify="center" bg={heroBg} color="white">
          <Stack spacing={{ base: 6, md: 8 }} maxW="600px">
            <Stack spacing={3}>
              <Text fontSize="sm" letterSpacing="widest" textTransform="uppercase" color="whiteAlpha.800">
                {t("landing.hero.kicker")}
              </Text>
              <Heading as="h1" size="2xl" lineHeight={1.1} textShadow="0 6px 18px rgba(0,0,0,0.35)">
                {t("landing.hero.title")}
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.900">
                {t("landing.hero.subtitle")}
              </Text>
            </Stack>
            <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
              <Button
                as={Link}
                to="/auth/login"
                size="lg"
                colorScheme="brandGold"
                bg="brand.gold"
                color="brand.deepGreen"
                _hover={{ bg: "brand.goldBright" }}
              >
                {t("landing.hero.ctaPrimary")}
              </Button>
              <Button
                as={Link}
                to="/about"
                variant="outline"
                size="lg"
                borderColor="whiteAlpha.800"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                {t("landing.hero.ctaSecondary")}
              </Button>
            </Stack>
            <Flex gap={6} wrap="wrap">
              {[
                { icon: PiChurchBold, label: t("landing.hero.stats.parish"), value: "120+" },
                { icon: PiUsersThreeBold, label: t("landing.hero.stats.members"), value: "350" },
                { icon: PiShieldCheckBold, label: t("landing.hero.stats.compliance"), value: "100%" },
              ].map((item) => (
                <Flex key={item.label} align="center" gap={3}>
                  <Flex
                    align="center"
                    justify="center"
                    boxSize="48px"
                    borderRadius="full"
                    bg="whiteAlpha.200"
                    border="1px solid rgba(255,255,255,0.35)"
                  >
                    <Icon as={item.icon} boxSize={6} />
                  </Flex>
                  <Stack spacing={0}>
                    <Text fontWeight="bold" fontSize="xl">
                      {item.value}
                    </Text>
                    <Text fontSize="sm" color="whiteAlpha.800">
                      {item.label}
                    </Text>
                  </Stack>
                </Flex>
              ))}
            </Flex>
          </Stack>
        </Flex>

        <Flex flex="1" p={{ base: 8, md: 16 }} align="center" justify="center">
          <Stack spacing={8} maxW="520px">
            <Heading size="lg" color="brand.deepRed">
              {t("landing.features.title")}
            </Heading>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              {[
                {
                  title: t("landing.features.secureFunds.title"),
                  description: t("landing.features.secureFunds.description"),
                  icon: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Lalibela_cross.svg",
                },
                {
                  title: t("landing.features.reporting.title"),
                  description: t("landing.features.reporting.description"),
                  icon: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Ethiopian_cross.svg",
                },
                {
                  title: t("landing.features.community.title"),
                  description: t("landing.features.community.description"),
                  icon: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Processional_cross_Ethiopia.svg",
                },
                {
                  title: t("landing.features.compliance.title"),
                  description: t("landing.features.compliance.description"),
                  icon: "https://upload.wikimedia.org/wikipedia/commons/4/40/Ark_of_the_Covenant_Church_Ethiopia.svg",
                },
              ].map((feature) => (
                <GridItem
                  key={feature.title}
                  border="1px solid"
                  borderColor="brand.goldSoft"
                  borderRadius="xl"
                  p={5}
                  bg="white"
                  boxShadow="sm"
                  _hover={{ boxShadow: "md", transform: "translateY(-4px)" }}
                  transition="all 0.2s ease"
                >
                  <Stack spacing={3}>
                    <Flex justify="space-between" align="center">
                      <Heading as="h3" size="md" color="brand.deepGreen">
                        {feature.title}
                      </Heading>
                      <Box boxSize="32px">
                        <img src={feature.icon} alt="" loading="lazy" style={{ width: "100%", height: "100%" }} />
                      </Box>
                    </Flex>
                    <Text fontSize="sm" color="brand.textMuted">
                      {feature.description}
                    </Text>
                  </Stack>
                </GridItem>
              ))}
            </Grid>

            <Stack spacing={3} bg="brand.goldSoft" borderRadius="lg" p={6} border="1px solid" borderColor="brand.gold">
              <Text fontWeight="semibold" color="brand.deepGreen">
                {t("landing.ctaBanner.title")}
              </Text>
              <Text fontSize="sm" color="brand.deepGreen">
                {t("landing.ctaBanner.description")}
              </Text>
              <Button
                as={Link}
                to="/auth/signup"
                alignSelf="flex-start"
                size="md"
                colorScheme="brandGreen"
                bg="brand.green"
                color="white"
                _hover={{ bg: "brand.greenDeep" }}
              >
                {t("landing.ctaBanner.button")}
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Flex>

      <Box as="section" bg="brand.deepGreen" color="white" py={{ base: 12, md: 16 }} px={{ base: 8, md: 16 }}>
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={10} align="center">
          <GridItem>
            <Heading size="lg" mb={3}>
              {t("landing.support.title")}
            </Heading>
            <Text color="whiteAlpha.800">{t("landing.support.subtitle")}</Text>
          </GridItem>
          <GridItem>
            <Stack spacing={3}>
              <Text fontWeight="bold" color="brand.gold">
                {t("landing.support.contact.label")}
              </Text>
              <Text>finance@eotc-toulouse.fr</Text>
              <Text>+33 5 61 00 00 00</Text>
            </Stack>
          </GridItem>
          <GridItem>
            <Stack spacing={3}>
              <Text fontWeight="bold" color="brand.gold">
                {t("landing.support.visit.label")}
              </Text>
              <Text>Paroisse Éthiopienne Orthodoxe, 15 Rue de l&apos;Église, 31000 Toulouse</Text>
            </Stack>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default LandingPage;