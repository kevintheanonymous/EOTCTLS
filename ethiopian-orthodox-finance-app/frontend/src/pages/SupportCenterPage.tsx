import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { PiChatsBold, PiPhoneBold, PiQuestionBold } from "react-icons/pi";

const SupportCenterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Stack spacing={2} align={{ base: "flex-start", md: "center" }} textAlign={{ base: "left", md: "center" }}>
          <Heading size="2xl" color="brand.deepGreen">
            {t("support.title")}
          </Heading>
          <Text color="brand.textMuted" maxW="2xl">
            {t("support.subtitle")}
          </Text>
        </Stack>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("support.contact.title")}
            </Heading>
          </CardHeader>
          <CardBody>
            <Flex direction={{ base: "column", md: "row" }} gap={6}>
              <Stack flex="1" spacing={4}>
                <Flex align="center" gap={3}>
                  <Icon as={PiPhoneBold} boxSize={6} color="brand.deepRed" />
                  <Text fontWeight="semibold" color="brand.deepGreen">
                    {t("support.contact.phone")}
                  </Text>
                </Flex>
                <Text color="brand.textMuted">+33 5 61 00 00 00</Text>
                <Flex align="center" gap={3}>
                  <Icon as={PiChatsBold} boxSize={6} color="brand.deepRed" />
                  <Text fontWeight="semibold" color="brand.deepGreen">
                    {t("support.contact.email")}
                  </Text>
                </Flex>
                <Text color="brand.textMuted">finance@eotc-toulouse.fr</Text>
              </Stack>
              <Stack flex="1" spacing={4}>
                <Heading size="sm" color="brand.deepGreen">
                  {t("support.contact.officeHours")}
                </Heading>
                <Text color="brand.textMuted">{t("support.contact.officeHoursDescription")}</Text>
                <Button
                  as="a"
                  href="mailto:finance@eotc-toulouse.fr"
                  colorScheme="brandGold"
                  bg="brand.gold"
                  color="brand.deepGreen"
                  _hover={{ bg: "brand.goldBright" }}
                >
                  {t("support.contact.sendEmail")}
                </Button>
              </Stack>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Flex align="center" gap={3}>
              <PiQuestionBold size={28} color="#A4252E" />
              <Stack spacing={1}>
                <Heading size="md" color="brand.deepGreen">
                  {t("support.faq.title")}
                </Heading>
                <Text fontSize="sm" color="brand.textMuted">
                  {t("support.faq.subtitle")}
                </Text>
              </Stack>
            </Flex>
          </CardHeader>
          <CardBody>
            <Accordion allowMultiple>
              {t("support.faq.items", { returnObjects: true })?.map(
                (item: { question: string; answer: string }, index: number) => (
                  <AccordionItem key={index} borderColor="brand.goldSoft">
                    <h2>
                      <AccordionButton>
                        <Box flex="1" textAlign="left" color="brand.deepGreen" fontWeight="semibold">
                          {item.question}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} color="brand.textMuted">
                      {item.answer}
                    </AccordionPanel>
                  </AccordionItem>
                ),
              )}
            </Accordion>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};

export default SupportCenterPage;