require 'fileutils'
require_relative 'templates/template_factory'
require 'open3'
require './conf'
require 'find'




def create_build_dir_name
  CONST::BUILD_DIR + '/'  + CONST::PREF_DIR_BUILD_NAME + Time.new.to_i.to_s
end

def create_build_dir
  dir = create_build_dir_name
  FileUtils.makedirs dir
  dir
end

def heroku_dir? dir_name
  dir_name.to_s.end_with? CONST::HEROKU_DIR_SUFFIX
end
def build_dirs(current_build_dir_name , templates_next_arr = [{:template_name => '', :ext_file =>''}])
  curr_build_dir = Dir[current_build_dir_name + '/*']
  curr_build_dir.each do |name_of_file_or_dir|
    if(File.directory? name_of_file_or_dir)
      isHeroku = heroku_dir? name_of_file_or_dir;
      name_of_file_or_dir_temp = (isHeroku ) ? name_of_file_or_dir + "/ext_files" : name_of_file_or_dir
      name_of_file_or_dir_heroku_public =  name_of_file_or_dir + "/public"
      templates_next_arr.each do |template_json|
        template_file = File.open("#{CONST::TEMPLATES_DIR}/#{template_json[:template_name]}", 'rb')
        File.open("#{name_of_file_or_dir_temp}/#{template_json[:ext_file]}", 'w')  { |f|
          config_file = "#{name_of_file_or_dir_temp}/#{CONST::EXTENSION_FILES::CONFIG_FILE_NAME}"
          load(config_file)
          f.puts TemplateFactory.new(config_file , template_file.read).render_template
          if(isHeroku)
            FileUtils.cp_r f,name_of_file_or_dir_heroku_public + '/'
          end
        }
      end

      ext_name = name_of_file_or_dir.to_s.gsub /.*?\//,''
      a, b = Open3.capture2(CONST::ZIP_PROGRAM_PATH, 'a', '-tzip' , "#{name_of_file_or_dir_temp}/#{ext_name}.zip" ,"#{name_of_file_or_dir_temp}/*" , "-r","-x!*.zip"  )
      puts a.to_s , b.to_s

    end
  end
end

def copy_without_unwanted_files(source_path, target_path)
  Find.find(source_path) do |source|
    target = source.sub(/^#{CONST::ROOT_BUILD}/, target_path)
    if File.directory? source
      Find.prune if (File.basename(source) == '.git' or File.basename(source).to_s.end_with? 'zip')
      FileUtils.mkdir target unless File.exists? target
    else
      FileUtils.copy source, target
    end
  end
end
def copy_orig_extensions_to_build_dir current_build_dir_name

  chrome_ext_dir = Dir[CONST::ROOT_BUILD + '/*']
  chrome_ext_dir.each do |item|
    must_not_copy_files_group = [CONST::BUILD_DIR , CONST::DEPLOYER_DIR_NAME ,".git" , ".zip" ]

    if !(item.to_s.include? CONST::BUILD_DIR or item.to_s.include? CONST::DEPLOYER_DIR_NAME or item.to_s.start_with? ".git" )
      copy_without_unwanted_files item , current_build_dir_name + '/'

    end

  end
end

def copy_build_dir_extensions_dir current_build_dir_name

  build_dir = Dir[current_build_dir_name + '/*']
  build_dir.each do |item|

    FileUtils.cp_r item ,CONST::ROOT_BUILD + '/'
  end
end


def render_templates_and_put_in_extensions current_build_dir_name
  bg_set = {:template_name => CONST::TEMPLATE_NAME::BG , :ext_file =>CONST::EXTENSION_FILES::BACKGROUND_NAME}
  menifest_set = {:template_name => CONST::TEMPLATE_NAME::MANIFEST , :ext_file =>CONST::EXTENSION_FILES::MENIFEST_NAME}
  content_set = {:template_name => CONST::TEMPLATE_NAME::CONTENT , :ext_file =>CONST::EXTENSION_FILES::CONTENT_NAME}
  wl_set = {:template_name => CONST::TEMPLATE_NAME::WL ,:ext_file =>CONST::EXTENSION_FILES::WL_NAME }
  searcher_set = {:template_name => CONST::TEMPLATE_NAME::SEARCHER ,:ext_file =>CONST::EXTENSION_FILES::SEARCHER_NAME }
  build_dirs current_build_dir_name  , [bg_set , menifest_set ,content_set , wl_set , searcher_set]
  copy_build_dir_extensions_dir current_build_dir_name
end


def run_build
  current_build_dir_name = create_build_dir
  copy_orig_extensions_to_build_dir current_build_dir_name
  render_templates_and_put_in_extensions current_build_dir_name
end

run_build













