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
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

type LoginFormValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await apiClient.post("/auth/login", values);
      toast({
        title: t("auth.login.successTitle"),
        description: t("auth.login.successMessage"),
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t("auth.login.errorTitle"),
        description: t("auth.login.errorMessage"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      as="main"
      minH="100vh"
      bgGradient="linear(to-br, brand.beige 0%, brand.goldSoft 40%, white 100%)"
      display="flex"
      alignItems="center"
    >
      <Container maxW="lg" py={{ base: 10, md: 16 }}>
        <Stack spacing={{ base: 8, md: 12 }}>
          <Stack spacing={3} textAlign="center">
            <Text fontSize="sm" textTransform="uppercase" letterSpacing="widest" color="brand.deepRed">
              {t("auth.login.kicker")}
            </Text>
            <Heading size="2xl" color="brand.deepGreen">
              {t("auth.login.title")}
            </Heading>
            <Text color="brand.textMuted">{t("auth.login.subtitle")}</Text>
          </Stack>

          <Flex
            direction="column"
            bg={useColorModeValue("white", "gray.800")}
            borderRadius="2xl"
            border="1px solid"
            borderColor="brand.goldSoft"
            shadow="xl"
            p={{ base: 8, md: 10 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={6}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel color="brand.deepGreen">{t("auth.login.emailLabel")}</FormLabel>
                  <Input
                    type="email"
                    placeholder={t("auth.login.emailPlaceholder") ?? ""}
                    bg="white"
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                    {...register("email", {
                      required: t("auth.login.validation.emailRequired") ?? "Required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("auth.login.validation.emailInvalid") ?? "Invalid email",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel color="brand.deepGreen">{t("auth.login.passwordLabel")}</FormLabel>
                  <Input
                    type="password"
                    placeholder={t("auth.login.passwordPlaceholder") ?? ""}
                    bg="white"
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                    {...register("password", {
                      required: t("auth.login.validation.passwordRequired") ?? "Required",
                      minLength: {
                        value: 8,
                        message: t("auth.login.validation.passwordLength") ?? "Password too short",
                      },
                    })}
                  />
                  <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                </FormControl>

                <Flex justify="space-between" align="center">
                  <Checkbox colorScheme="brandGreen" {...register("rememberMe")}>
                    {t("auth.login.rememberMe")}
                  </Checkbox>
                  <Link as={RouterLink} to="/auth/forgot-password" color="brand.deepRed" fontWeight="semibold">
                    {t("auth.login.forgotPassword")}
                  </Link>
                </Flex>

                <Button
                  type="submit"
                  size="lg"
                  colorScheme="brandGreen"
                  bg="brand.green"
                  color="white"
                  _hover={{ bg: "brand.greenDeep" }}
                  isLoading={isSubmitting}
                >
                  {t("auth.login.submit")}
                </Button>
              </Stack>
            </form>

            <Divider my={8} borderColor="brand.goldSoft" />

            <Stack spacing={3} textAlign="center">
              <Text color="brand.textMuted">{t("auth.login.signupPrompt")}</Text>
              <Button
                as={RouterLink}
                to="/auth/signup"
                variant="outline"
                colorScheme="brandGold"
                borderColor="brand.gold"
                color="brand.deepGreen"
                _hover={{ bg: "brand.goldSoft" }}
              >
                {t("auth.login.signupButton")}
              </Button>
            </Stack>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;