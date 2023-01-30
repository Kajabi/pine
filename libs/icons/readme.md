# Sage Icons

This is the Icon Library for Sage.


## Figma Export
In order to export icons you will need to follow the steps listed below.

### Creating a Figma access token
1. Navigate to [Figma](https://www.figma.com) and login with your credentials.
2. Click your Profile avatar and select 'Settings'.
3. Scroll down until you see 'Personal access tokens'.
4. Under 'Create a new personal access token:' enter a token description and hit enter.
5. You should now see a token that you will need to copy and save somewhere safe.

### Setting up the configuration file
The configuration file `figma-icon-config.json` is used to access the API, filter pages and frames located within. Below you will see an example configuration file.

figma-icon-config.json
```
{
  "figmaAccessToken": "some-access-token",
  "figmaFileId": "figma-file-id",
  "branchName": "reorg",
  "pageName": "Icons",
  "outputPath": "src/svg",
  "ignoreFrames": ["_Countries", "Docs"]
}
```

#### Attributes
|name|type|required|env var|description|
|---|---|---|-----|---|
|figmaAccessToken|string|true|FIGMA_ACCESS_TOKEN|The Personal Access token that you have created in your account. See [above](#creating-a-figma-access-token). You can either set in the config or as environment variable, but one needs to be set.|
|figmaFileId|string|true|FIGMA_FILE_ID|The unique id for the file. This can be found in the url, when viewing the Figma file. e.g `https://www.figma.com/file/some-unique-id`. In the example this would be `some-unique-id`|
|branchName|string|false||Name of the branch|
|pageName|string|true||Name of the page the icons can be found|
|ouputPath|string|true||Location which the raw svgs should be saved|
|ignoreFrames|array|false||Name(s) of frames that may be located in the page you wish to ignore. If there is only one frame, please add it in array format e.g ['Frame to Ignore']

**NOTE**: The `figmaAccessToken` and `figmaFileId` can be set in either the configuration file or as an environment variable. The environment variable will take precedence over the configuration file.

Example on how to use environment variables
```sh
FIGMA_ACCESS_TOKEN=[mySampleAccessToken] yarn nx run icons:update
```

### Exporting Icons
In order to run the export, you can run the command below.

```sh
yarn nx run icons:update
```
