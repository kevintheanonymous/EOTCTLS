import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import apiClient from "../services/apiClient";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: "fr" | "am";
};

type SecurityFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();

  const {
    handleSubmit: submitProfile,
    register: registerProfile,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      language: (i18n.language as "fr" | "am") ?? "fr",
    },
  });

  const {
    handleSubmit: submitSecurity,
    register: registerSecurity,
    watch: watchSecurity,
    reset: resetSecurity,
    formState: { errors: securityErrors, isSubmitting: isSubmittingSecurity },
  } = useForm<SecurityFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (values: ProfileFormValues) => {
    try {
      await apiClient.put("/users/me", values);
      i18n.changeLanguage(values.language);
      toast({
        title: t("settings.profile.successTitle"),
        description: t("settings.profile.successMessage"),
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("settings.profile.errorTitle"),
        description: t("settings.profile.errorMessage"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSecuritySubmit = async (values: SecurityFormValues) => {
    try {
      await apiClient.put("/users/me/security", values);
      resetSecurity();
      toast({
        title: t("settings.security.successTitle"),
        description: t("settings.security.successMessage"),
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: t("settings.security.errorTitle"),
        description: t("settings.security.errorMessage"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="main" py={{ base: 8, md: 12 }} px={{ base: 4, md: 10 }} bg="brand.beige" minH="100vh">
      <Stack spacing={{ base: 8, md: 12 }}>
        <Stack spacing={2}>
          <Heading size="2xl" color="brand.deepGreen">
            {t("settings.title")}
          </Heading>
          <Text color="brand.textMuted">{t("settings.subtitle")}</Text>
        </Stack>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("settings.profile.title")}
            </Heading>
            <Text fontSize="sm" color="brand.textMuted">
              {t("settings.profile.subtitle")}
            </Text>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <form onSubmit={submitProfile(onProfileSubmit)} noValidate>
              <Stack spacing={6}>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                  <FormControl isInvalid={!!profileErrors.firstName}>
                    <FormLabel color="brand.deepGreen">{t("settings.profile.firstName")}</FormLabel>
                    <Input
                      placeholder={t("settings.profile.firstNamePlaceholder") ?? ""}
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...registerProfile("firstName", {
                        required: t("settings.validation.required") ?? "Required",
                      })}
                    />
                    <FormErrorMessage>{profileErrors.firstName?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!profileErrors.lastName}>
                    <FormLabel color="brand.deepGreen">{t("settings.profile.lastName")}</FormLabel>
                    <Input
                      placeholder={t("settings.profile.lastNamePlaceholder") ?? ""}
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...registerProfile("lastName", {
                        required: t("settings.validation.required") ?? "Required",
                      })}
                    />
                    <FormErrorMessage>{profileErrors.lastName?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!profileErrors.email}>
                    <FormLabel color="brand.deepGreen">{t("settings.profile.email")}</FormLabel>
                    <Input
                      type="email"
                      placeholder={t("settings.profile.emailPlaceholder") ?? ""}
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...registerProfile("email", {
                        required: t("settings.validation.required") ?? "Required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: t("settings.validation.emailInvalid") ?? "Invalid email",
                        },
                      })}
                    />
                    <FormErrorMessage>{profileErrors.email?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!profileErrors.phone}>
                    <FormLabel color="brand.deepGreen">{t("settings.profile.phone")}</FormLabel>
                    <Input
                      type="tel"
                      placeholder={t("settings.profile.phonePlaceholder") ?? ""}
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...registerProfile("phone", {
                        required: t("settings.validation.required") ?? "Required",
                      })}
                    />
                    <FormErrorMessage>{profileErrors.phone?.message}</FormErrorMessage>
                  </FormControl>
                </Grid>

                <FormControl>
                  <FormLabel color="brand.deepGreen">{t("settings.profile.language")}</FormLabel>
                  <Select
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                    {...registerProfile("language")}
                  >
                    <option value="fr">{t("settings.profile.languageOptions.fr")}</option>
                    <option value="am">{t("settings.profile.languageOptions.am")}</option>
                  </Select>
                </FormControl>

                <Flex justify="flex-end">
                  <Button
                    type="submit"
                    colorScheme="brandGold"
                    bg="brand.gold"
                    color="brand.deepGreen"
                    _hover={{ bg: "brand.goldBright" }}
                    isLoading={isSubmittingProfile}
                  >
                    {t("settings.profile.submit")}
                  </Button>
                </Flex>
              </Stack>
            </form>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="lg">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("settings.security.title")}
            </Heading>
            <Text fontSize="sm" color="brand.textMuted">
              {t("settings.security.subtitle")}
            </Text>
          </CardHeader>
          <Divider borderColor="brand.goldSoft" />
          <CardBody>
            <form onSubmit={submitSecurity(onSecuritySubmit)} noValidate>
              <Stack spacing={6}>
                <FormControl isInvalid={!!securityErrors.currentPassword}>
                  <FormLabel color="brand.deepGreen">{t("settings.security.currentPassword")}</FormLabel>
                  <Input
                    type="password"
                    placeholder={t("settings.security.currentPasswordPlaceholder") ?? ""}
                    borderColor="brand.goldSoft"
                    focusBorderColor="brand.gold"
                    {...registerSecurity("currentPassword", {
                      required: t("settings.validation.required") ?? "Required",
                    })}
                  />
                  <FormErrorMessage>{securityErrors.currentPassword?.message}</FormErrorMessage>
                </FormControl>

                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                  <FormControl isInvalid={!!securityErrors.newPassword}>
                    <FormLabel color="brand.deepGreen">{t("settings.security.newPassword")}</FormLabel>
                    <Input
                      type="password"
                      placeholder={t("settings.security.newPasswordPlaceholder") ?? ""}
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...registerSecurity("newPassword", {
                        required: t("settings.validation.required") ?? "Required",
                        minLength: {
                          value: 8,
                          message: t("settings.validation.passwordLength") ?? "Too short",
                        },
                      })}
                    />
                    <FormErrorMessage>{securityErrors.newPassword?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!securityErrors.confirmPassword}>
                    <FormLabel color="brand.deepGreen">{t("settings.security.confirmPassword")}</FormLabel>
                    <Input
                      type="password"
                      placeholder={t("settings.security.confirmPasswordPlaceholder") ?? ""}
                      borderColor="brand.goldSoft"
                      focusBorderColor="brand.gold"
                      {...registerSecurity("confirmPassword", {
                        required: t("settings.validation.required") ?? "Required",
                        validate: (value) =>
                          value === watchSecurity("newPassword") ||
                          t("settings.validation.passwordMismatch") ||
                          "Passwords do not match",
                      })}
                    />
                    <FormErrorMessage>{securityErrors.confirmPassword?.message}</FormErrorMessage>
                  </FormControl>
                </Grid>

                <Flex justify="flex-end">
                  <Button
                    type="submit"
                    colorScheme="brandGreen"
                    bg="brand.green"
                    color="white"
                    _hover={{ bg: "brand.greenDeep" }}
                    isLoading={isSubmittingSecurity}
                  >
                    {t("settings.security.submit")}
                  </Button>
                </Flex>
              </Stack>
            </form>
          </CardBody>
        </Card>

        <Card bg="white" borderRadius="2xl" border="1px solid" borderColor="brand.goldSoft" shadow="md">
          <CardHeader>
            <Heading size="md" color="brand.deepGreen">
              {t("settings.alerts.title")}
            </Heading>
            <Text fontSize="sm" color="brand.textMuted">
              {t("settings.alerts.subtitle")}
            </Text>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {["budgetThreshold", "auditReminders", "volunteerOpportunities"].map((item) => (
                <Flex key={item} justify="space-between" align="center">
                  <Stack spacing={0}>
                    <Text fontWeight="semibold" color="brand.deepGreen">
                      {t(`settings.alerts.items.${item}.title`)}
                    </Text>
                    <Text fontSize="sm" color="brand.textMuted">
                      {t(`settings.alerts.items.${item}.description`)}
                    </Text>
                  </Stack>
                  <Switch defaultChecked colorScheme="brandGold" />
                </Flex>
              ))}
            </Stack>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  );
};

export default SettingsPage;