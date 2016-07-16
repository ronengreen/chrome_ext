
class TemplateFactory

  def initialize(config_file, template )
    @config_file = config_file
    @templte = template

  end

  def render_template
    load @config_file
    @templte = @templte.gsub(/RNG_EXT_NAME_RNG/ ,CONFIG_EXT::EXT_NAME )
                   .gsub(/RNG_OPDOM_NAME_RNG/ , CONFIG_EXT::OPDOM)
                   .gsub(/RNG_SHOULD_REPORT_EVENTS_RNG/ ,CONFIG_EXT::SHOULD_REPORT)
                   .gsub(/RNG_REPORT_HB_RNG/ ,CONFIG_EXT::REPORT_HB)
                   .gsub(/RNG_IS_ACTIVE_RNG/ ,CONFIG_EXT::IS_ACTIVE)

  end






end