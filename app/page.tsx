export default function RootRedirect() {
  return (
    <div style={{ display: 'none' }}>
      <script dangerouslySetInnerHTML={{
        __html: 'window.location.replace("/en/")'
      }} />
    </div>
  );
}
