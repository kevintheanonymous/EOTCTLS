import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import apiClient from "../../services/apiClient";

type ForgotPasswordFormValues = {
  email: string;
};

const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await apiClient.post("/auth/forgot-password", values);
      toast({
        title: t("auth.forgotPassword.successTitle"),
        description: t("auth.forgotPassword.successMessage"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("auth.forgotPassword.errorTitle"),
        description: t("auth.forgotPassword.errorMessage"),
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      as="main"
      minH="100vh"
      bgGradient="linear(to-b, rgba(230,180,34,0.2), rgba(16,40,28,0.85))"
      display="flex"
      alignItems="center"
      py={{ base: 10, md: 16 }}
    >
      <Container maxW="lg">
        <Stack spacing={{ base: 8, md: 12 }}>
          <Stack spacing={3} textAlign="center">
            <Text fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="brand.deepRed">
              {t("auth.forgotPassword.kicker")}
            </Text>
            <Heading size="2xl" color="brand.deepGreen">
              {t("auth.forgotPassword.title")}
            </Heading>
            <Text color="brand.textMuted">{t("auth.forgotPassword.subtitle")}</Text>
          </Stack>

          <Flex
            direction="column"
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="brand.goldSoft"
            shadow="xl"
            p={{ base: 8, md: 10 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={6}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color="brand.deepGreen">{t("auth.forgotPassword.emailLabel")}</FormLabel>
                  <Input
                    type="email"
                    placeholder={t("auth.forgotPassword.emailPlaceholder") ?? ""}
                    bg="white"
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                    {...register("email", {
                      required: t("auth.forgotPassword.validation.emailRequired") ?? "Required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("auth.forgotPassword.validation.emailInvalid") ?? "Invalid email",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  colorScheme="brandGold"
                  bg="brand.gold"
                  color="brand.deepGreen"
                  _hover={{ bg: "brand.goldBright" }}
                  isLoading={isSubmitting}
                >
                  {t("auth.forgotPassword.submit")}
                </Button>
              </Stack>
            </form>

            <Stack spacing={3} mt={8} textAlign="center">
              <Text color="brand.textMuted">{t("auth.forgotPassword.backToLoginPrompt")}</Text>
              <Button
                as={RouterLink}
                to="/auth/login"
                variant="outline"
                colorScheme="brandGreen"
                borderColor="brand.green"
                color="brand.deepGreen"
                _hover={{ bg: "brand.goldSoft" }}
              >
                {t("auth.forgotPassword.backToLoginButton")}
              </Button>
            </Stack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;