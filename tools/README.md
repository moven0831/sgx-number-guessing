# Useful JS Tools

`hexConvert.js` is a simple NodeJS program that allows converting binary values to hexstrings. You may simply run the progrom to either:

- Convert a quote bin file to hexstrings:

```bash
node hexConvert.js -b <path-to-quote-bin-file>
```

OR

- Convert a `Uint8Array` to hexstrings:

```bash
node hexConvert.js -a "1,2,3,..." # do not include square brackets
```