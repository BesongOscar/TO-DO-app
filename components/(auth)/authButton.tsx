import { TouchableOpacity } from "react-native";
import { Text, StyleSheet } from "react-native";
import { fontReg, fontBold } from "styles/common";

type AuthButtonProps = {
  text: string;
  color: string;
  textColor: string;
  borderColor: string;
  onPress: () => void;
};
export const AuthButton = ({
  text,
  color,
  textColor,
  borderColor,
  onPress,
}: AuthButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color, borderColor: borderColor },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    margin: 5,
    justifyContent: "center",
    shadowColor: "red",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.65,
    shadowRadius: 3.84,
    elevation: 1,
  },
  buttonText: {
    fontWeight: "500",
    fontSize: 14,
    fontFamily: fontReg,
  },
});
