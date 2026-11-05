import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <script async defer src="https://js.whop.com/static/checkout/loader.js" />
        {/* Microsoft Clarity Analytics */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "z93wd6ghdh");`,
          }}
        />
      </Head>
      <body className="min-h-screen bg-background antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
