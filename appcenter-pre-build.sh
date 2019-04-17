echo "Injecting secrets..."
echo "Updating Google JSON"
echo $GOOGLE_SERVICES_JSON | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/android/app/google-services.json"
echo "Updating Google plist"
echo $GOOGLE_SERVICES_PLIST | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/ios/dryvofront/GoogleService-Info.plist"
echo "Updating android secret"
echo $ANDROID_SECRET | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/android/app/src/main/assets/appcenter-config.json"
echo "Updating iOS secret"
echo $IOS_SECRET | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/ios/dryvofront/AppCenter-Config.plist"
echo "Finished injecting secrets."

# echo "replacing codepush secrets..."
# sed -i '' 's/<string>CODE_HERE/<string>$CODEPUSH_SECRET/' ios/dryvofront/Info.plist
# sed -i '' 's/>CODE_HERE/>$CODEPUSH_SECRET/' android/app/src/main/res/values/strings.xml
# echo "Finished replacing codepush secrets."

echo "Creating env..."
if [ $ENV_FILE = "production" ]; then
   cp .env.production .env
else
   cp .env.staging .env
fi

sed -i '' 's/"CP"/"$CODEPUSH_SECRET"/' .env
echo "\n.env created with contents:\n"
cat .env