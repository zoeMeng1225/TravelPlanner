package travelplanner;

import java.util.Properties;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
@EnableWebMvc
public class ApplicationConfig {

	@Bean(name = "sessionFactory")
	public LocalSessionFactoryBean sessionFactory() {
		LocalSessionFactoryBean sessionFactory = new LocalSessionFactoryBean();
		sessionFactory.setDataSource(dataSource());
		sessionFactory.setPackagesToScan("travelplanner.model");
		sessionFactory.setHibernateProperties(hibernateProperties());
		return sessionFactory;
	}

	@Bean(name = "dataSource")
	public DataSource dataSource() {
		DriverManagerDataSource dataSource = new DriverManagerDataSource();
		dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
//		dataSource.setUrl("jdbc:mysql://laiproject-database.cdazhgm4d1gk.us-east-2.rds.amazonaws.com:3306/travelplannertest?serverTimezone=UTC");
//		dataSource.setUsername("hengli");
//		dataSource.setPassword("1234567890");
		dataSource.setUrl("jdbc:mysql://laiproject-instance.c3ogt4w4g8fq.us-west-1.rds.amazonaws.com:3306/travelplanner?serverTimezone=UTC");
		dataSource.setUsername("admin");
		dataSource.setPassword("12345678");
//		dataSource.setUrl("jdbc:mysql://127.0.0.1:3306/travelplanner?serverTimezone=UTC");
//		dataSource.setUsername("root");
//		dataSource.setPassword("12345678");

		return dataSource;
	}

//	@Bean
//	public MultipartResolver multipartResolver() {
//		CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
//		multipartResolver.setMaxUploadSize(10240000);
//		return multipartResolver;
//	}

	private final Properties hibernateProperties() {
		Properties hibernateProperties = new Properties();
		hibernateProperties.setProperty("hibernate.hbm2ddl.auto", "update");
		hibernateProperties.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL5Dialect");
		return hibernateProperties;
	}
}
