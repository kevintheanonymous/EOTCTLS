import { Box, Button, Heading, Image, Stack, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box as="main" minH="100vh" bg="brand.beige" display="flex" alignItems="center" justifyContent="center" px={6}>
      <Stack spacing={6} align="center" textAlign="center" maxW="lg">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Lalibela_cross.svg/384px-Lalibela_cross.svg.png"
          alt={t("notFound.imageAlt") ?? ""}
          maxW="160px"
          opacity={0.7}
        />
        <Heading size="2xl" color="brand.deepGreen">
          {t("notFound.title")}
        </Heading>
        <Text color="brand.textMuted">{t("notFound.subtitle")}</Text>
        <Button
          as={RouterLink}
          to="/"
          colorScheme="brandGold"
          bg="brand.gold"
          color="brand.deepGreen"
          _hover={{ bg: "brand.goldBright" }}
        >
          {t("notFound.cta")}
        </Button>
      </Stack>
    </Box>
  );
};

export default NotFoundPage;