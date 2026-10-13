// Run before paint so a saved preference never flashes the opposite palette.
const script = `(()=>{const root=document.documentElement;let preference;try{preference=localStorage.getItem('portfolio-theme')}catch{}if(preference==='light'||preference==='dark')root.dataset.themePreference=preference;root.dataset.theme=root.dataset.themePreference||'dark'})()`;

export function ThemeInit() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
