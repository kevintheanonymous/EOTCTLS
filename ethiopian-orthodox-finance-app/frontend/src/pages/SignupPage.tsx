import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

type SignupFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await apiClient.post("/auth/signup", values);
      toast({
        title: t("auth.signup.successTitle"),
        description: t("auth.signup.successMessage"),
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/auth/login");
    } catch (error) {
      toast({
        title: t("auth.signup.errorTitle"),
        description: t("auth.signup.errorMessage"),
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
      bgGradient="linear(to-br, rgba(16,40,28,0.8), rgba(230,180,34,0.85))"
      display="flex"
      alignItems="center"
      py={{ base: 10, md: 16 }}
    >
      <Container maxW="lg">
        <Stack spacing={{ base: 8, md: 12 }}>
          <Stack spacing={3} textAlign="center">
            <Text fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="brand.gold">
              {t("auth.signup.kicker")}
            </Text>
            <Heading size="2xl" color="white">
              {t("auth.signup.title")}
            </Heading>
            <Text color="whiteAlpha.800">{t("auth.signup.subtitle")}</Text>
          </Stack>

          <Flex
            direction="column"
            bg="white"
            borderRadius="2xl"
            border="1px solid"
            borderColor="brand.goldSoft"
            shadow="2xl"
            p={{ base: 8, md: 10 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={5}>
                <Stack direction={{ base: "column", md: "row" }} spacing={5}>
                  <FormControl isInvalid={!!errors.firstName}>
                    <FormLabel color="brand.deepGreen">{t("auth.signup.firstNameLabel")}</FormLabel>
                    <Input
                      placeholder={t("auth.signup.firstNamePlaceholder") ?? ""}
                      bg="white"
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...register("firstName", {
                        required: t("auth.signup.validation.firstNameRequired") ?? "Required",
                      })}
                    />
                    <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.lastName}>
                    <FormLabel color="brand.deepGreen">{t("auth.signup.lastNameLabel")}</FormLabel>
                    <Input
                      placeholder={t("auth.signup.lastNamePlaceholder") ?? ""}
                      bg="white"
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...register("lastName", {
                        required: t("auth.signup.validation.lastNameRequired") ?? "Required",
                      })}
                    />
                    <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
                  </FormControl>
                </Stack>

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color="brand.deepGreen">{t("auth.signup.emailLabel")}</FormLabel>
                  <Input
                    type="email"
                    placeholder={t("auth.signup.emailPlaceholder") ?? ""}
                    bg="white"
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                    {...register("email", {
                      required: t("auth.signup.validation.emailRequired") ?? "Required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("auth.signup.validation.emailInvalid") ?? "Invalid email",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.phone}>
                  <FormLabel color="brand.deepGreen">{t("auth.signup.phoneLabel")}</FormLabel>
                  <Input
                    type="tel"
                    placeholder={t("auth.signup.phonePlaceholder") ?? ""}
                    bg="white"
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                    {...register("phone", {
                      required: t("auth.signup.validation.phoneRequired") ?? "Required",
                    })}
                  />
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>

                <Stack direction={{ base: "column", md: "row" }} spacing={5}>
                  <FormControl isInvalid={!!errors.password}>
                    <FormLabel color="brand.deepGreen">{t("auth.signup.passwordLabel")}</FormLabel>
                    <Input
                      type="password"
                      placeholder={t("auth.signup.passwordPlaceholder") ?? ""}
                      bg="white"
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...register("password", {
                        required: t("auth.signup.validation.passwordRequired") ?? "Required",
                        minLength: {
                          value: 8,
                          message: t("auth.signup.validation.passwordLength") ?? "Too short",
                        },
                      })}
                    />
                    <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.confirmPassword}>
                    <FormLabel color="brand.deepGreen">{t("auth.signup.confirmPasswordLabel")}</FormLabel>
                    <Input
                      type="password"
                      placeholder={t("auth.signup.confirmPasswordPlaceholder") ?? ""}
                      bg="white"
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...register("confirmPassword", {
                        required: t("auth.signup.validation.confirmPasswordRequired") ?? "Required",
                        validate: (value) =>
                          value === watch("password") ||
                          t("auth.signup.validation.passwordsMismatch") ||
                          "Passwords do not match",
                      })}
                    />
                    <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
                  </FormControl>
                </Stack>

                <FormControl isInvalid={!!errors.termsAccepted}>
                  <Checkbox colorScheme="brandGreen" {...register("termsAccepted", { required: true })}>
                    {t("auth.signup.termsAgreement")}
                  </Checkbox>
                  <FormErrorMessage>
                    {errors.termsAccepted && t("auth.signup.validation.termsRequired")}
                  </FormErrorMessage>
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
                  {t("auth.signup.submit")}
                </Button>
              </Stack>
            </form>

            <Divider my={6} borderColor="brand.goldSoft" />

            <Stack spacing={3} textAlign="center">
              <Text color="brand.textMuted">{t("auth.signup.loginPrompt")}</Text>
              <Button
                as={RouterLink}
                to="/auth/login"
                variant="outline"
                colorScheme="brandGreen"
                borderColor="brand.green"
                color="brand.deepGreen"
                _hover={{ bg: "brand.goldSoft" }}
              >
                {t("auth.signup.loginButton")}
              </Button>
            </Stack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default SignupPage;