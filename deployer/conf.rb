

module CONST
  ROOT_BUILD = "C:/dev/chrome_ex"
  BUILD_DIR_NAME = "builds"
  BUILD_DIR = "#{ROOT_BUILD}/#{BUILD_DIR_NAME}"
  TEMPLATES_DIR_NAME = "templates"
  PREF_DIR_BUILD_NAME ="build_"
  DEPLOYER_DIR_NAME = "deployer"
  DEPLOYER_DIR = "#{ROOT_BUILD}/#{DEPLOYER_DIR_NAME}"
  TEMPLATES_DIR = "#{DEPLOYER_DIR}/#{TEMPLATES_DIR_NAME}"
  ZIP_PROGRAM_PATH = "./utils/7-Zip/7z.exe"
  HEROKU_DIR_SUFFIX = "_heroku"
  module TEMPLATE_NAME
    BG = "background_template.js"
    CONTENT = "content_template.js"
    MANIFEST = "manifest_template.json"
    WL = "wl_template.js"
    SEARCHER = "searcher_template.html"

  end
  module EXTENSION_FILES
    CONFIG_FILE_NAME = "config.rb"
    BACKGROUND_NAME = "background.js"
    MENIFEST_NAME = "manifest.json"
    CONTENT_NAME = "content.js"
    WL_NAME = "wl.js"
    SEARCHER_NAME = "searcher.html"
  end
end


