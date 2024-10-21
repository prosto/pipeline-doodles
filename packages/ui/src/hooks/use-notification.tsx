import { useState } from "react";

export function useNotification(): {
  visible: boolean;
  text: string;
  showNotification: (text: string, ms: number) => void;
} {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  const showNotification = (msg: string, ms: number): void => {
    setVisible(true);
    setText(msg);
    setTimeout(() => {
      setVisible(false);
    }, ms);
  };

  return {
    visible,
    text,
    showNotification,
  };
}
