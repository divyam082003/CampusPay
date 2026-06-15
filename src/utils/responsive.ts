// utils/responsive.ts

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const wp = (percentage: number) =>
  (width * percentage) / 100;

export const hp = (percentage: number) =>
  (height * percentage) / 100;

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;