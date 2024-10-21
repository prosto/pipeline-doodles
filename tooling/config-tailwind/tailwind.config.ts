import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  prefix: "tw-",
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Default border color
        border: "hsl(var(--border))",
        // Border color for inputs such as <Input />, <Select />, <Textarea />
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Default background color of <body />...etc
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Primary colors for <Button />
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Secondary colors for <Button />
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Used for destructive actions such as <Button variant="destructive">
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        // Muted backgrounds such as <TabsList />, <Skeleton /> and <Switch />
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        // Used for accents such as hover effects on <DropdownMenuItem>, <SelectItem>...etc
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // Background color for popovers such as <DropdownMenu />, <HoverCard />, <Popover />
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Background color for <Card />
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        section: {
          DEFAULT: "hsl(var(--section) / <alpha-value>)",
          foreground: "hsl(var(--section-foreground) / <alpha-value>)",
        },
      },
      // Border radius for card, input and buttons
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },

      flexGrow: {
        2: "2",
      },

      patterns: {
        opacities: {
          100: "1",
          80: ".80",
          60: ".60",
          40: ".40",
          20: ".20",
          10: ".10",
          5: ".05",
        },
        sizes: {
          1: "0.25rem",
          2: "0.5rem",
          4: "1rem",
          6: "1.5rem",
          8: "2rem",
          16: "4rem",
          20: "5rem",
          24: "6rem",
          32: "8rem",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwindcss-bg-patterns")],
};

export default config;
