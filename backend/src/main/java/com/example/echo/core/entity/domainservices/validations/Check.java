package com.example.echo.core.entity.domainservices.validations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

public class Check {

    public static boolean isNullString(String s) {
        return s == null;
    }

    public static boolean minStringChars(String s, int minChars) {
        return (s != null) && s.trim().length() >= minChars;
    }

    public static boolean maxStringChars(String s, int maxChars) {
        return (s != null) && s.trim().length() <= maxChars;
    }

    public static boolean isValidString(String s, int minChars, int maxChars) {
        if (maxChars == 0) {
            return minStringChars(s, minChars);
        } else {
            return minStringChars(s, minChars) && maxStringChars(s, maxChars);
        }
    }

    public static boolean isValidNumber(int value, int minValue) {
        if (value < minValue) {
            return false;
        } else {
            return true;
        }
    }

    // ───────────────────────────────────────────
    // NULL & EMPTY
    // ───────────────────────────────────────────

    public static boolean isNull(Object o) {
        return o == null;
    }

    public static boolean notNull(Object o) {
        return o != null;
    }

    public static boolean isEmpty(String s) {
        return s == null || s.trim().isEmpty();
    }

    public static boolean notEmpty(String s) {
        return !isEmpty(s);
    }

    // ───────────────────────────────────────────
    // STRING LENGTH
    // ───────────────────────────────────────────

    public static boolean minLength(String s, int min) {
        return notEmpty(s) && s.trim().length() >= min;
    }

    public static boolean maxLength(String s, int max) {
        return notEmpty(s) && s.trim().length() <= max;
    }

    public static boolean lengthBetween(String s, int min, int max) {
        return notEmpty(s) && s.trim().length() >= min && s.trim().length() <= max;
    }

    // ───────────────────────────────────────────
    // NUMBERS
    // ───────────────────────────────────────────

    public static boolean isInt(String s) {
        if (isEmpty(s))
            return false;
        try {
            Integer.parseInt(s);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean isDouble(String s) {
        if (isEmpty(s))
            return false;
        try {
            Double.parseDouble(s);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean minInt(int value, int min) {
        return value >= min;
    }

    public static boolean maxInt(int value, int max) {
        return value <= max;
    }

    public static boolean minDouble(double value, double min) {
        return value >= min;
    }

    public static boolean maxDouble(double value, double max) {
        return value <= max;
    }

    public static boolean isPositive(int value) {
        return value > 0;
    }

    public static boolean isPositive(double value) {
        return value > 0;
    }

    public static boolean isValidDouble(double value, double min, double max) {
        return value >= min && value <= max;
    }

    // ───────────────────────────────────────────
    // PATTERNS
    // ───────────────────────────────────────────

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private static final Pattern PHONE_PATTERN = Pattern.compile("^[0-9+()\\- ]{6,20}$");

    private static final Pattern LETTERS_ONLY_PATTERN = Pattern.compile("^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$");

    public static boolean isEmail(String s) {
        return notEmpty(s) && EMAIL_PATTERN.matcher(s.trim()).matches();
    }

    public static boolean isPhone(String s) {
        return notEmpty(s) && PHONE_PATTERN.matcher(s.trim()).matches();
    }

    public static boolean isOnlyLetters(String s) {
        return notEmpty(s) && LETTERS_ONLY_PATTERN.matcher(s.trim()).matches();
    }

    // ───────────────────────────────────────────
    // DATES & TIMES
    // ───────────────────────────────────────────

    public static final DateTimeFormatter DEFAULT_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    public static boolean isValidDate(String dateString, DateTimeFormatter formatter) {
        if (isEmpty(dateString))
            return false;
        try {
            LocalDate.parse(dateString, formatter);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static boolean isValidDateTime(String dateTime, DateTimeFormatter formatter) {
        if (isEmpty(dateTime))
            return false;
        try {
            LocalDateTime.parse(dateTime, formatter);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static LocalDate toLocalDate(String date, DateTimeFormatter formatter) {
        return isValidDate(date, formatter) ? LocalDate.parse(date, formatter) : null;
    }

    public static LocalDateTime toLocalDateTime(String dateTime, DateTimeFormatter formatter) {
        return isValidDateTime(dateTime, formatter) ? LocalDateTime.parse(dateTime, formatter) : null;
    }

}