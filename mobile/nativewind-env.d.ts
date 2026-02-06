/// <reference types="nativewind/types" />

import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface FlatListProps<ItemT> {
    className?: string;
  }
  interface SectionListProps<ItemT, SectionT> {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
  interface StatusBarProps {
    className?: string;
  }
  interface ActivityIndicatorProps {
    className?: string;
  }
}
