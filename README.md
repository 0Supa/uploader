## Specification

### Sibling domains

- **[i.supa.codes](https://i.supa.codes/)**
- [kappa.lol](https://kappa.lol/)
- [gachi.gay](https://gachi.gay/)
- [femboy.beauty](https://femboy.beauty/)

**User uploads:**
1. Files are accessible cross-domain, content is identical.
2. File extensions (delimited by `.`) are optional and ignored.
3. Any parts of the URL after the first segment (delimited by `/`) are ignored.
4. Any subdomain may be used on root domains.

**These are all valid examples and link to the same resource:**
- `https://kappa.lol/mXYBA`
- `https://billy.gachi.gay/mXYBA.png`
- `https://i.supa.codes/mXYBA/Kappa.png`

## License

### TL;DR

The AGPL 3.0 license requires anyone who modifies or distributes the software to make their source code available to end-users when the software is used over a network. It's like the GPL but with extra coverage for network usage.

## Developing

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
