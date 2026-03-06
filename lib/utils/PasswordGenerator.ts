// ── Character sets ───────────────────────────────────────────
const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  special: "$", // Only dollar sign for NestJS @isStrong() compatibility
};

// ── Secure random index ──────────────────────────────────────
function secureRandom(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

// ── Validation ───────────────────────────────────────────────
interface PasswordValidation {
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  hasLength: boolean;
  isValid: boolean;
}

function validatePassword(
  password: string,
  options: PasswordGeneratorOptions,
): PasswordValidation {
  return {
    hasUppercase: !options.uppercase || /[A-Z]/.test(password),
    hasLowercase: !options.lowercase || /[a-z]/.test(password),
    hasNumber: !options.numbers || /[0-9]/.test(password),
    hasSpecial: !options.special || /\$/.test(password), // Only check for dollar sign
    hasLength: password.length >= (options.length || 16),
    isValid: true, // set below
  };
}

// ── Generator options ─────────────────────────────────────────
export interface PasswordGeneratorOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  special?: boolean;
}

export interface GeneratedPassword {
  password: string;
  validation: PasswordValidation;
}

// ── Generator function ───────────────────────────────────────
function* passwordGenerator(
  options: PasswordGeneratorOptions = {},
): Generator<GeneratedPassword> {
  const {
    length = 12,
    uppercase = true,
    lowercase = true,
    numbers = true,
    special = true,
  } = options;

  // Ensure minimum length of 8 characters for strong passwords
  const finalLength = Math.max(length, 8);

  let pool = "";
  if (uppercase) pool += CHARSETS.uppercase;
  if (lowercase) pool += CHARSETS.lowercase;
  if (numbers) pool += CHARSETS.numbers;
  if (special) pool += CHARSETS.special;

  if (!pool) throw new Error("Enable at least one character type");

  while (true) {
    // 1. Guarantee one char from each enabled type
    const guaranteed = [
      uppercase && CHARSETS.uppercase[secureRandom(CHARSETS.uppercase.length)],
      lowercase && CHARSETS.lowercase[secureRandom(CHARSETS.lowercase.length)],
      numbers && CHARSETS.numbers[secureRandom(CHARSETS.numbers.length)],
      special && CHARSETS.special[secureRandom(CHARSETS.special.length)],
    ].filter(Boolean);

    // 2. For strong passwords, ensure we have at least one of each required type
    if (uppercase && lowercase && numbers && special) {
      // We already have guaranteed chars for each type
    }

    // 3. Fill the rest randomly from the full pool
    const remaining = Array.from(
      { length: finalLength - guaranteed.length },
      () => pool[secureRandom(pool.length)],
    );

    // 4. Shuffle everything (Fisher-Yates)
    const chars = [...guaranteed, ...remaining];
    for (let i = chars.length - 1; i > 0; i--) {
      const j = secureRandom(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    const password = chars.join("");
    const validation = validatePassword(password, {
      ...options,
      length: finalLength,
    });
    validation.isValid = Object.values(validation).every(Boolean);

    // Only yield passwords that meet all strong password requirements
    if (validation.isValid) {
      yield { password, validation };
    }
  }
}

// ── Convenience function ─────────────────────────────────────
export function generatePassword(
  options: PasswordGeneratorOptions = {},
): GeneratedPassword {
  const generator = passwordGenerator(options);
  const result = generator.next();
  if (result.done) {
    throw new Error("Failed to generate password");
  }
  return result.value;
}

// ── Default student password generator ───────────────────────
export function generateStudentPassword(): string {
  // Generate strong password that passes NestJS @isStrong() DTO validation
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const { password, validation } = generatePassword({
      length: 12, // Use 12 characters to exceed minimum 8 requirement
      uppercase: true, // Required by @isStrong()
      lowercase: true, // Required by @isStrong()
      numbers: true, // Required by @isStrong()
      special: true, // Required by @isStrong()
    });

    // Ensure password passes all @isStrong() validation requirements
    if (
      validation.isValid &&
      password.length >= 8 && // @isStrong() minimum length
      /[A-Z]/.test(password) && // At least one uppercase
      /[a-z]/.test(password) && // At least one lowercase
      /[0-9]/.test(password) && // At least one number
      /\$/.test(password)
    ) {
      // At least one dollar sign (special char)
      return password;
    }

    attempts++;
  }

  // Fallback - create a guaranteed strong password for @isStrong()
  const guaranteedStrong =
    CHARSETS.uppercase[secureRandom(CHARSETS.uppercase.length)] +
    CHARSETS.lowercase[secureRandom(CHARSETS.lowercase.length)] +
    CHARSETS.numbers[secureRandom(CHARSETS.numbers.length)] +
    CHARSETS.special[secureRandom(CHARSETS.special.length)] +
    Array.from(
      { length: 8 },
      () => CHARSETS.uppercase[secureRandom(CHARSETS.uppercase.length)],
    ).join("");

  // Shuffle the guaranteed strong password
  const chars = guaranteedStrong.split("");
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}
