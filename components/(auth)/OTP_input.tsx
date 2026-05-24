import React, { useRef } from "react";
import { TextInput, View } from "react-native";
import { useThemeStyles } from "../../src/hooks/useThemeStyles";
import { createOTPInputStyles } from "../../styles/components/(auth)/OTP_input";

type OTPInputProps = {
  value: string;
  onChange: (val: string) => void;
  length?: number; // default 6
};

export default function OTPInput({
  value,
  onChange,
  length = 4,
}: OTPInputProps) {
  const styles = useThemeStyles(createOTPInputStyles);
  const digits = value.split(""); // break current OTP into an array
  const inputs = useRef<(TextInput | null)[]>([]); // store refs for all inputs

  const handleChange = (text: string, index: number) => {
    const newDigits = [...digits];
    newDigits[index] = text; // replace digit at current index

    const newValue = newDigits.join("");
    onChange(newValue); // update formik

    // move focus to next box if user typed a digit
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    // move back if user deleted
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.OTPcontainer}>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          //ref={(ref) => (inputs.current[index] = ref)}
          ref={(ref) => {
            inputs.current[index] = ref;
          }} // save ref
          style={styles.OTPinput}
          keyboardType="number-pad"
          maxLength={1} // only 1 digit allowed
          value={digits[index] || ""} // controlled input
          onChangeText={(text) => handleChange(text, index)}
        />
      ))}
    </View>
  );
}
