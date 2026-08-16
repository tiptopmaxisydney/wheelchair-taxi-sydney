"use client";

// Same AntD theme tokens as tiptopnextjs's src/lib/AntConfig.tsx, adapted for direct
// import (no next/dynamic wrapper — that was a Pages Router SSR workaround that isn't
// needed, and isn't reliable, under the App Router).
import { ConfigProvider } from "antd";
import React from "react";

// Matches --wt-blue in app/globals.css. Hardcoded (not a CSS var) because
// antd computes hover/active shade tokens from this value in JS at theme-build
// time, before any stylesheet is resolved.
export const colorPrimary = "#1d69b4";

const AntConfig = (props: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: colorPrimary,
          colorError: "#D85B3C",
          fontSize: 16,
          fontSizeHeading1: 100,
          fontSizeHeading2: 63.71,
          fontSizeHeading3: 64,
          fontSizeHeading4: 32,
          fontSizeHeading5: 18,
        },
        components: {
          Button: {
            controlHeightSM: 36,
            controlHeightLG: 48,
            borderRadiusLG: 4,
            borderRadiusSM: 4,
            fontWeight: 700,
            borderRadius: 4,
            fontSizeLG: 16,
            colorTextDisabled: "#B8B8C6",
            borderColorDisabled: "#E8E8F4",
            colorBgContainerDisabled: "#E8E8F4",
            defaultBorderColor: "#4312A0",
          },
          Input: {
            controlHeightSM: 36,
            controlHeightLG: 50,
            controlHeight: 36,
            borderRadiusLG: 4,
            borderRadiusSM: 4,
            borderRadius: 4,
            colorTextLabel: "rgba(64, 69, 72, 1)",
            colorTextPlaceholder: "rgba(64, 69, 72, 1)",
            fontWeightStrong: 700,
            colorBorder: "#000",
            controlOutline: "0",
          },
          InputNumber: {
            controlHeightSM: 36,
            controlHeightLG: 50,
            controlHeight: 36,
            borderRadiusLG: 4,
            borderRadiusSM: 4,
            borderRadius: 4,
            colorTextPlaceholder: "#78756D",
            fontWeightStrong: 700,
            colorBorder: "#C3C2BE",
          },
          Divider: {
            colorSplit: "rgb(195, 194, 190, 0.6)",
          },
          Select: {
            controlHeight: 36,
            borderRadius: 4,
            borderRadiusLG: 4,
            controlHeightLG: 50,
            colorTextPlaceholder: "#B8B8C6",
            fontWeightStrong: 400,
            optionSelectedFontWeight: 400,
            colorBorder: "#000",
            optionActiveBg: "#fff",
            fontSize: 14,
            colorBgContainer: "transparent",
            controlOutline: "0",
          },
          DatePicker: {
            controlHeight: 48,
            controlHeightLG: 50,
            borderRadius: 4,
            colorTextPlaceholder: "#78756D",
            fontWeightStrong: 700,
            colorText: "#282518",
            colorBorder: "#000",
          },
          Rate: {
            marginXS: 4,
          },
          Checkbox: {
            fontSize: 14,
            fontWeightStrong: 600,
          },
          Breadcrumb: {
            fontSize: 14,
            colorText: "#282518",
            fontWeightStrong: 500,
            colorPrimaryText: "#282518",
          },
          Tabs: {
            cardHeight: 30,
            fontSize: 14,
            fontWeightStrong: 500,
            colorBorderSecondary: "#ffffff",
            inkBarColor: "#ffffff",
            colorFillAlter: "#ffffff",
            colorBgContainer: "#FFF2CF",
            borderRadius: 12,
            borderRadiusLG: 12,
            borderRadiusOuter: 12,
            borderRadiusSM: 12,
            borderRadiusXS: 12,
            margin: 30,
          },
          Collapse: {
            colorBorder: "#C3C2BE",
          },
          Spin: {
            colorFill: "#C3C2BE",
          },
        },
      }}
    >
      {props.children}
    </ConfigProvider>
  );
};

export default AntConfig;
