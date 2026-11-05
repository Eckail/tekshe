import { registerHooks } from "node:module";

// Node's built-in TypeScript stripping does not resolve the extensionless
// relative imports used by the Next.js app. Add `.ts` only in this test hook.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch (error) {
        if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
      }
    }

    return nextResolve(specifier, context);
  },
});
