import React from "react";
import { View } from "react-native";
import Svg, { Path, Circle, Polygon, Defs, LinearGradient, Stop } from "react-native-svg";

export function SolanaLogo() {
    return (
        <View className="w-12 h-12 rounded-full bg-black justify-center items-center">
            <Svg width={28} height={22} viewBox="0 0 397.7 311.7">
                <Defs>
                    <LinearGradient id="solGrad1" x1="360.88" y1="-37.46" x2="141.21" y2="383.29" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#00FFA3" />
                        <Stop offset="1" stopColor="#DC1FFF" />
                    </LinearGradient>
                    <LinearGradient id="solGrad2" x1="264.83" y1="-87.6" x2="45.16" y2="333.15" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#00FFA3" />
                        <Stop offset="1" stopColor="#DC1FFF" />
                    </LinearGradient>
                    <LinearGradient id="solGrad3" x1="312.55" y1="-62.69" x2="92.88" y2="358.06" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#00FFA3" />
                        <Stop offset="1" stopColor="#DC1FFF" />
                    </LinearGradient>
                </Defs>
                <Path fill="url(#solGrad1)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z" />
                <Path fill="url(#solGrad2)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z" />
                <Path fill="url(#solGrad3)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4c5.8,0,8.7-7,4.6-11.1L333.1,120.1z" />
            </Svg>
        </View>
    );
}

export function EthereumLogo() {
    return (
        <View className="w-12 h-12 rounded-full bg-[#627eea] justify-center items-center">
            <Svg width={22} height={36} viewBox="0 0 784.37 1277.39">
                <Polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54" />
                <Polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 0,650.54 392.07,882.29 392.07,472.33" />
                <Polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89" />
                <Polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 0,724.89" />
                <Polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33" />
                <Polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33" />
            </Svg>
        </View>
    );
}

export function BitcoinLogo() {
    return (
        <View className="w-12 h-12 rounded-full bg-[#f7931a] justify-center items-center overflow-hidden">
            <Svg width={48} height={48} viewBox="0 0 4091.27 4091.73">
                <Path fill="#F7931A" fillRule="nonzero" d="M4030.06 2540.77c-273.24,1096.01 -1383.32,1763.02 -2479.46,1489.71 -1095.68,-273.24 -1762.69,-1383.39 -1489.33,-2479.31 273.12,-1096.13 1383.2,-1763.19 2479,-1489.95 1096.06,273.24 1763.03,1383.51 1489.76,2479.57l0.02 -0.02z" />
                <Path fill="white" fillRule="nonzero" d="M2947.77 1754.38c40.72,-272.26 -166.56,-418.61 -450,-516.24l91.95 -368.8 -224.5 -55.94 -89.51 359.09c-59.02,-14.72 -119.63,-28.59 -179.87,-42.34l90.16 -361.46 -224.36 -55.94 -92 368.68c-48.84,-11.12 -96.81,-22.11 -143.35,-33.69l0.26 -1.16 -309.59 -77.31 -59.72 239.78c0,0 166.56,38.18 163.05,40.53 90.91,22.69 107.35,82.87 104.62,130.57l-104.74 420.15c6.26,1.59 14.38,3.89 23.34,7.49 -7.49,-1.86 -15.46,-3.89 -23.73,-5.87l-146.81 588.57c-11.11,27.62 -39.31,69.07 -102.87,53.33 2.25,3.26 -163.17,-40.72 -163.17,-40.72l-111.46 256.98 292.15 72.83c54.35,13.63 107.61,27.89 160.06,41.3l-92.9 373.03 224.24 55.94 92 -369.07c61.26,16.63 120.71,31.97 178.91,46.43l-91.69 367.33 224.51 55.94 92.89 -372.33c382.82,72.45 670.67,43.24 791.83,-303.02 97.63,-278.78 -4.86,-439.58 -206.26,-544.44 146.69,-33.83 257.18,-130.31 286.64,-329.61l-0.07 -0.05zm-512.93 719.26c-69.38,278.78 -538.76,128.08 -690.94,90.29l123.28 -494.2c152.17,37.99 640.17,113.17 567.67,403.91zm69.43 -723.3c-63.29,253.58 -453.96,124.75 -580.69,93.16l111.77 -448.21c126.73,31.59 534.85,90.55 468.94,355.05l-0.02 0z" />
            </Svg>
        </View>
    );
}

export function MonadLogo() {
    return (
        <View className="w-12 h-12 rounded-full bg-[#7c5fe3] justify-center items-center">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={8} stroke="white" strokeWidth={2} />
                <Path d="M8 12a4 4 0 108 0 4 4 0 00-8 0" fill="white" opacity={0.3} />
            </Svg>
        </View>
    );
}
