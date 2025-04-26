import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export const useHideTabBar = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const parent = navigation.getParent();
        parent?.setOptions({ tabBarStyle: { display: 'none' } });
  
    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);
};