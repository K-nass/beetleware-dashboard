import * as Yup from "yup";

// Reusable field validators

/**
 * Email validation schema
 * Validates that the email is required and in a valid format
 */
export const emailSchema = Yup.string()
  .required("Email is required")
  .email("Email is invalid");

/**
 * Phone validation schema (Saudi format)
 * Validates that the phone number starts with 5 and is 9 digits total
 */
export const phoneSchema = Yup.string()
  .required("Phone number is required")
  .matches(/^5\d{8}$/, "Phone number must start with 5 and be 9 digits total");

/**
 * Password validation schema
 * Validates minimum length and character requirements
 */
export const passwordSchema = Yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[a-zA-Z]/, "Password must contain letters")
  .matches(/[0-9]/, "Password must contain numbers");

/**
 * Password with confirmation schema
 * Validates both password and confirmation match
 */
export const passwordWithConfirmationSchema = Yup.object({
  password: passwordSchema.required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .test("passwords-match", "Passwords do not match", function (value) {
      return this.parent.password === value;
    }),
});

/**
 * Helper function to create a required string validator
 * @param fieldName - The name of the field for the error message
 */
export const requiredString = (fieldName: string) =>
  Yup.string().required(`${fieldName} is required`);

/**
 * Helper function to create a positive number validator
 * @param fieldName - The name of the field for the error message
 */
export const positiveNumber = (fieldName: string) =>
  Yup.number()
    .required(`${fieldName} is required`)
    .typeError(`${fieldName} must be a valid number`)
    .positive(`${fieldName} must be greater than zero`);

// Form-specific schemas

/**
 * Price change form validation schema
 */
export const priceChangeSchema = Yup.object({
  suggestedPrice: Yup.number()
    .required("Please enter a suggested price")
    .typeError("Please enter a valid number")
    .positive("Price must be greater than zero"),
  reason: Yup.string().nullable(),
  landId: Yup.number()
    .required("Invalid listing ID")
    .typeError("Invalid listing ID"),
});

/**
 * User form validation schema with conditional validation
 * @param userType - The type of user (Internal or External)
 * @param mode - The form mode (add or edit)
 */
export const createUserFormSchema = (
  userType: number,
  mode: "add" | "edit",
) => {
  return Yup.object({
    email: emailSchema,
    fullName: Yup.string().required("Full name is required"),
    phoneNumber: phoneSchema,
    password:
      mode === "add"
        ? passwordSchema.required("Password is required")
        : passwordSchema.optional(),
    confirmPassword: Yup.string().when("password", {
      is: (password: string) => password && password.length > 0,
      then: (schema) =>
        schema
          .required("Confirm Password is required")
          .test("passwords-match", "Passwords do not match", function (value) {
            return this.parent.password === value;
          }),
      otherwise: (schema) => schema.optional(),
    }),
    // Internal user fields (UserTypeEnum.Internal = 1)
    role:
      userType === 1
        ? Yup.string().required("Role is required for internal users")
        : Yup.string().optional(),
    nationalId: Yup.string().required(
      userType === 1
        ? "National ID is required for internal users"
        : "National ID is required for external users",
    ),
    // External user fields (UserTypeEnum.External = 2)
    genderId:
      userType === 2
        ? Yup.string().required("Gender is required for external users")
        : Yup.string().optional(),
    dateOfBirth:
      userType === 2
        ? Yup.string().required("Date of birth is required for external users")
        : Yup.string().optional(),
  });
};

/**
 * Classification form validation schema
 */
export const classificationSchema = Yup.object({
  selectedClassificationId: Yup.number()
    .required("Please select a classification")
    .typeError("Please select a classification"),
  landId: Yup.number()
    .required("Invalid listing ID")
    .typeError("Invalid listing ID"),
});

/**
 * Role form validation schema
 */
export const roleFormSchema = Yup.object({
  roleName: Yup.string()
    .required("Role name is required")
    .min(2, "Role name must be at least 2 characters")
    .max(100, "Role name must not exceed 100 characters")
    .trim(),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .trim(),
  isActive: Yup.boolean().required(),
  selectedClaimIds: Yup.array()
    .of(Yup.number())
    .min(1, "At least one permission must be selected")
    .required("At least one permission must be selected"),
});

/**
 * Add listing form validation schema
 */
export const addListingSchema = Yup.object({
  userId: Yup.number().nullable(),
  agentId: Yup.number().nullable(),
  title: Yup.string(),
  description: Yup.string(),
  area: Yup.number()
    .required("Area is required")
    .positive("Area must be greater than 0")
    .typeError("Area must be a valid number"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be greater than 0")
    .typeError("Price must be a valid number"),
  cityId: Yup.number()
    .required("City is required")
    .typeError("City is required"),
  regionId: Yup.number()
    .required("Region is required")
    .typeError("Region is required"),
  address: Yup.string(),
  googleMapsLink: Yup.string().url("Must be a valid URL"),
  landTypeId: Yup.number().nullable(),
  landFacingId: Yup.number().nullable(),
  ownershipStatusId: Yup.number().nullable(),
  deedTypeId: Yup.number().nullable(),
  neighborTypeId: Yup.number().nullable(),
  classificationId: Yup.number().nullable(),
  features: Yup.array().of(Yup.string()),
  imageUrls: Yup.array().of(Yup.string()),
  explanatoryVideoUrl: Yup.string().url("Must be a valid URL"),
  titleDeedUrl: Yup.string().url("Must be a valid URL"),
  nationalIdCopyUrl: Yup.string().url("Must be a valid URL"),
  landSurveyReportUrl: Yup.string().url("Must be a valid URL"),
  statusId: Yup.number().nullable(),
  buyerId: Yup.number().nullable(),
  purchasedPrice: Yup.number()
    .nullable()
    .positive("Purchased price must be greater than 0"),
});

/**
 * Edit listing form validation schema (reuses add listing schema)
 */
export const editListingSchema = addListingSchema.shape({
  id: Yup.number().required(),
  reason: Yup.string(),
});

/**
 * Communications form validation schema
 */
export const communicationsSchema = Yup.object({
  whatsAppNumber: Yup.string()
    .required("WhatsApp number is required")
    .trim(),
  contactUsEmail: emailSchema,
  supportEmail: emailSchema,
  businessHours: Yup.string()
    .required("Business hours are required")
    .trim(),
  timeZone: Yup.string()
    .required("Time zone is required")
    .trim(),
});

/**
 * Commission offer form validation schema
 */
export const commissionOfferSchema = Yup.object({
  globalCommissionRate: Yup.number()
    .required("Global commission rate is required")
    .typeError("Global commission rate must be a valid number")
    .min(0, "Global commission rate must be between 0 and 100")
    .max(100, "Global commission rate must be between 0 and 100"),
  minOfferPercent: Yup.number()
    .required("Minimum offer percentage is required")
    .typeError("Minimum offer percentage must be a valid number")
    .min(0, "Minimum offer percentage must be between 0 and 100")
    .max(100, "Minimum offer percentage must be between 0 and 100")
    .test(
      "min-less-than-max",
      "Minimum offer must be less than maximum offer",
      function (value) {
        const { maxOfferPercent } = this.parent;
        if (value === undefined || maxOfferPercent === undefined) return true;
        return value <= maxOfferPercent;
      }
    ),
  maxOfferPercent: Yup.number()
    .required("Maximum offer percentage is required")
    .typeError("Maximum offer percentage must be a valid number")
    .min(0, "Maximum offer percentage must be between 0 and 100")
    .max(100, "Maximum offer percentage must be between 0 and 100")
    .test(
      "max-greater-than-min",
      "Maximum offer must be greater than minimum offer",
      function (value) {
        const { minOfferPercent } = this.parent;
        if (value === undefined || minOfferPercent === undefined) return true;
        return value >= minOfferPercent;
      }
    ),
});
