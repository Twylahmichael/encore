// FLAG: the live site's Privacy Policy is the unedited WordPress default
// boilerplate — every section still says "Suggested text:" verbatim,
// meaning nobody replaced it with the site's actual policy. Replicated
// exactly as published (word-for-word) rather than "fixed," per the
// instruction to flag rather than silently resolve inconsistencies.
export function PrivacyPolicy() {
  return (
    <section className="py-16">
      <div className="max-w-site mx-auto px-6 max-w-3xl">
        <h1 className="text-3xl md:text-4xl mb-4">Privacy Policy</h1>
        <p className="text-sm text-efn-black/50 mb-10 bg-efn-offwhite p-4">
          Note: this page is reproduced exactly as published on the live site — it is the
          default WordPress privacy policy template, not yet customized for Encore Fitness
          and Nutrition. Every "Suggested text" line below is boilerplate, verbatim.
        </p>

        <div className="space-y-8 text-efn-black/80">
          <div>
            <h2 className="text-xl font-semibold mb-2">Who we are</h2>
            <p>Suggested text: Our website address is: https://efn.co.ke.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            <p>Suggested text: When visitors leave comments on the site we collect the data shown in the comments form, and also the visitor's IP address and browser user agent string to help spam detection.</p>
            <p>An anonymized string created from your email address (also called a hash) may be provided to the Gravatar service to see if you are using it. The Gravatar service privacy policy is available here: https://automattic.com/privacy/. After approval of your comment, your profile picture is visible to the public in the context of your comment.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Media</h2>
            <p>Suggested text: If you upload images to the website, you should avoid uploading images with embedded location data (EXIF GPS) included. Visitors to the website can download and extract any location data from images on the website.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Cookies</h2>
            <p>Suggested text: If you leave a comment on our site you may opt-in to saving your name, email address and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.</p>
            <p>If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.</p>
            <p>When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.</p>
            <p>If you edit or publish an article, an additional cookie will be saved in your browser. This cookie includes no personal data and simply indicates the post ID of the article you just edited. It expires after 1 day.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Embedded content from other websites</h2>
            <p>Suggested text: Articles on this site may include embedded content (e.g. videos, images, articles, etc.). Embedded content from other websites behaves in the exact same way as if the visitor has visited the other website.</p>
            <p>These websites may collect data about you, use cookies, embed additional third-party tracking, and monitor your interaction with that embedded content, including tracking your interaction with the embedded content if you have an account and are logged in to that website.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Who we share your data with</h2>
            <p>Suggested text: If you request a password reset, your IP address will be included in the reset email.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">How long we retain your data</h2>
            <p>Suggested text: If you leave a comment, the comment and its metadata are retained indefinitely. This is so we can recognize and approve any follow-up comments automatically instead of holding them in a moderation queue.</p>
            <p>For users that register on our website (if any), we also store the personal information they provide in their user profile. All users can see, edit, or delete their personal information at any time (except they cannot change their username). Website administrators can also see and edit that information.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">What rights you have over your data</h2>
            <p>Suggested text: If you have an account on this site, or have left comments, you can request to receive an exported file of the personal data we hold about you, including any data you have provided to us. You can also request that we erase any personal data we hold about you. This does not include any data we are obliged to keep for administrative, legal, or security purposes.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Where your data is sent</h2>
            <p>Suggested text: Visitor comments may be checked through an automated spam detection service.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
