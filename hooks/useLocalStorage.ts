import { useEffect, useState } from "react";

const useLocalStorage = (key: string) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    const localData = localStorage.getItem(key);

    if (localData === null) {
      setValue("");
    } else {
      if (typeof localData === "string") {
        setValue(localData!);
      } else {
        setValue(JSON.parse(localData!));
      }
    }
  }, []);

  return [value];
};

export default useLocalStorage;
