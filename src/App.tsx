"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, RefreshCw, Shield } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import * as Switch from "@radix-ui/react-switch";

const Toast = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed text-pretty flex items-start bottom-5 right-5 bg-gray-700 text-white max-h-sm max-w-sm px-4 py-2 rounded-lg shadow-lg">
      {message}
      <button onClick={onClose} className="ml-3 text-sm text-gray-300">
        ✕
      </button>
    </div>
  );
};

export default function App() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(15);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);

  const generatePassword = useCallback(() => {
    const specialChars = [
      33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60,
      61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126,
    ];
    const numChars = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
    const lettersChars = [
      65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
      83, 84, 85, 86, 87, 88, 89, 90,
    ];

    let passwordArray: number[] = [];

    if (includeSymbols) {
      passwordArray = passwordArray.concat(specialChars);
    }

    if (includeNumbers) {
      passwordArray = passwordArray.concat(numChars);
    }

    if (includeUppercase) {
      passwordArray = passwordArray.concat(lettersChars);
    }

    if (includeLowercase) {
      passwordArray = passwordArray.concat(lettersChars.map((x) => x + 32));
    }

    if (
      !includeSymbols &&
      !includeNumbers &&
      !includeUppercase &&
      !includeLowercase
    ) {
      setPassword("");
      setToast(
        "Please select an option to include letters, numbers or special characters.",
      );
      showToast();
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random() * passwordArray.length);
      result += String.fromCharCode(passwordArray[random]);
    }

    if (excludeSimilar) {
      result = result.replace(/[il1Lo0O]/g, "");
    }
    setPassword(result);
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
  ]);

  const initial = useRef({
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
  });

  const [toast, setToast] = useState<string | null>(null);
  const showToast = () => {
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setToast("Password copied to clipboard");
      showToast();
    } catch (err) {
      console.error("Failed to copy password", err);
    }
  };

  const getStrengthColor = () => {
    if (length <= 14) return "text-red-500";
    if (length <= 29) return "text-yellow-300";
    if (length < 90) return "text-green-300/80";
    if (length >= 90) {
      if (
        (includeLowercase || includeUppercase) &&
        includeNumbers &&
        includeSymbols &&
        excludeSimilar
      ) {
        return "text-green-300";
      } else {
        return "text-green-300/80";
      }
    }
  };

  const getStrengthText = () => {
    if (length <= 14) return "Weak";
    if (length <= 29) return "Medium";
    if (length < 90) return "Strong";
    if (length >= 90) {
      if (
        (includeLowercase || includeUppercase) &&
        includeNumbers &&
        includeSymbols &&
        excludeSimilar
      ) {
        return "Very Strong";
      } else {
        return "Strong";
      }
    }
  };

  useEffect(() => {
    const changed =
      length !== initial.current.length ||
      includeUppercase !== initial.current.includeUppercase ||
      includeLowercase !== initial.current.includeLowercase ||
      includeNumbers !== initial.current.includeNumbers ||
      includeSymbols !== initial.current.includeSymbols ||
      excludeSimilar !== initial.current.excludeSimilar;

    if (!changed) return;
    generatePassword();
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeSimilar,
    generatePassword,
  ]);

  return (
    <main className="min-h-screen min-w-svw bg-gray-300 p-6 sm:p-12 lg:p-20">
      <section className="mx-auto sm:max-w-xl lg:max-w-2xl">
        <section className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-white hidden sm:block" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Password Generator Tool
            </h1>
          </div>
          <p className="text-balance">
            Create strong, secure passwords to protect your accounts
          </p>
        </section>
        <section className="mb-6 space-y-6 bg-gray-400 p-6 rounded-2xl shadow-lg">
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold">Generate Password</h2>
            <p className="text-sm text-gray-700 font-semibold">
              Customize your password settings below
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="password-output">
                Your Password:
              </label>
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <input
                  id="password-output"
                  value={password}
                  readOnly
                  placeholder="Click 'Generate Password' to create your password"
                  className="text-black font-extrabold flex-grow placeholder:font-mono placeholder:text-sm placeholder:font-extralight"
                />
                <button
                  className="flex text-white items-center justify-center gap-2 bg-gray-600 hover:not-disabled:bg-gray-700 stroke-white rounded-xl p-2 sm:p-4 disabled:opacity-35"
                  onClick={copyToClipboard}
                  disabled={!password}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sm:sr-only">Copy it</span>
                </button>
              </div>
              {password ? (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Strength:</span>
                  <span className={`font-medium ${getStrengthColor()}`}>
                    {getStrengthText()}
                  </span>
                </div>
              ) : (
                <span className="block h-5 w-full" />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm">Password Length</p>
                <span className="text-sm font-medium text-muted-foreground">
                  {length} characters
                </span>
              </div>
              <Slider.Root
                className="relative flex items-center touch-none select-none h-6 w-full"
                id="length"
                min={5}
                max={99}
                step={1}
                value={[length]}
                onValueChange={(value) => {
                  setLength(value[0]);
                }}
              >
                <Slider.Track className="bg-gray-300 relative flex-grow rounded-full h-1">
                  <Slider.Range className="absolute h-full rounded-full bg-gray-700" />
                </Slider.Track>
                <Slider.Thumb
                  className="block w-5 h-5 bg-white shadow-2xl rounded-full"
                  aria-label="Volume"
                />
              </Slider.Root>
            </div>

            <div className="space-y-4">
              <p className="text-center font-semibold">Password Options</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="uppercase" className="text-sm font-normal">
                    Uppercase Letters (A-Z)
                  </label>
                  <Switch.Root
                    className="relative h-[25px] w-[42px] bg-gray-300 data-[state=checked]:bg-gray-700 rounded-full shadow-2xl"
                    id="uppercase"
                    name="uppercase"
                    value="uppercase"
                    checked={includeUppercase}
                    onCheckedChange={() => {
                      setIncludeUppercase(!includeUppercase);
                    }}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white shadow-2xl rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="lowercase" className="text-sm font-normal">
                    Lowercase Letters (a-z)
                  </label>
                  <Switch.Root
                    className="relative h-[25px] w-[42px] bg-gray-300 data-[state=checked]:bg-gray-700 rounded-full shadow-2xl"
                    id="lowercase"
                    name="lowercase"
                    value="lowercase"
                    checked={includeLowercase}
                    onCheckedChange={() => {
                      setIncludeLowercase(!includeLowercase);
                    }}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white shadow-2xl rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="numbers" className="text-sm font-normal">
                    Numbers (0-9)
                  </label>
                  <Switch.Root
                    className="relative h-[25px] w-[42px] bg-gray-300 data-[state=checked]:bg-gray-700 rounded-full shadow-2xl"
                    id="numbers"
                    name="numbers"
                    value="numbers"
                    checked={includeNumbers}
                    onCheckedChange={() => {
                      setIncludeNumbers(!includeNumbers);
                    }}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white shadow-2xl rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="symbols" className="text-sm font-normal">
                    Symbols (!@#$...)
                  </label>
                  <Switch.Root
                    className="relative h-[25px] w-[42px] bg-gray-300 data-[state=checked]:bg-gray-700 rounded-full shadow-2xl"
                    id="symbols"
                    name="symbols"
                    value="symbols"
                    checked={includeSymbols}
                    onCheckedChange={() => {
                      setIncludeSymbols(!includeSymbols);
                    }}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white shadow-2xl rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <label
                  htmlFor="exclude-similar"
                  className="text-sm font-normal"
                >
                  Exclude Similar Characters (i, l, 1, L, o, 0, O)
                </label>
                <Switch.Root
                  className="shrink-0 relative h-[25px] w-[42px] bg-gray-300 data-[state=checked]:bg-gray-700 rounded-full shadow-2xl"
                  id="exclude-similar"
                  name="exclude-similar"
                  value="exclude-similar"
                  checked={excludeSimilar}
                  onCheckedChange={() => {
                    setExcludeSimilar(!excludeSimilar);
                  }}
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white shadow-2xl rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[19px]" />
                </Switch.Root>
              </div>
            </div>

            <button
              onClick={() => {
                generatePassword();
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white w-full flex justify-center items-center gap-2 p-4 rounded-xl group"
            >
              <RefreshCw className="h-4 w-4 mr-2 group-hover:motion-safe:animate-[spin_1.5s_linear_0.5]" />
              Generate Password
              <span className="sr-only">Generate Password</span>
            </button>
          </div>
        </section>
        <section className="bg-gray-400 p-6 space-y-6 rounded-2xl shadow-lg">
          <details open={window.innerWidth > 768} className="space-y-2">
            <summary className="font-semibold text-lg hover:cursor-pointer">
              Description / How to use:
            </summary>
            <ul className="space-y-2 text-sm [&>li]:ml-5 list-disc">
              <li>Select the length of your desire password</li>
              <li>
                Select if you want to include letters (uppercase and/or
                lowercase), numbers or special characters
              </li>
              <li>Click the 'Generate Password' button</li>
            </ul>
          </details>

          <details open={window.innerWidth > 768} className="space-y-2">
            <summary className="font-semibold text-lg hover:cursor-pointer">
              Security Tips
            </summary>
            <ul className="space-y-2 text-sm [&>li]:ml-5 list-disc">
              <li>Use a unique password for each account</li>
              <li>Store passwords in a secure password manager</li>
              <li>Enable two-factor authentication when available</li>
              <li>Avoid using personal information in passwords</li>
            </ul>
          </details>
        </section>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </section>
    </main>
  );
}
