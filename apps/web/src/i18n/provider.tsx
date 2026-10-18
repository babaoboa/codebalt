import type { ReactNode } from "react";

import { IntlayerProvider } from "react-intlayer";

/**
 * Wrap your React app with this provider so that components can read Intlayer
 * content with `useIntlayer`. The active locale is detected from storage/cookie
 * and the `intlayer.config.ts` configuration when no `locale` prop is passed.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  return <IntlayerProvider>{children}</IntlayerProvider>;
}
