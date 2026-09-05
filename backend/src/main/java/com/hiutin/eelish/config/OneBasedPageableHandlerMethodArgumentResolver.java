package com.hiutin.eelish.config;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.MethodParameter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
class WebConfig implements WebMvcConfigurer {
    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new OneBasedPageableHandlerMethodArgumentResolver());
        WebMvcConfigurer.super.addArgumentResolvers(resolvers);
    }
}

public class OneBasedPageableHandlerMethodArgumentResolver 
        extends PageableHandlerMethodArgumentResolver {

    public OneBasedPageableHandlerMethodArgumentResolver() {
        setMaxPageSize(100);
    }

    @Override
    public Pageable resolveArgument(MethodParameter methodParameter,
                                     ModelAndViewContainer mavContainer,
                                     NativeWebRequest webRequest,
                                     WebDataBinderFactory binderFactory) {

        Pageable pageable = super.resolveArgument(methodParameter, mavContainer, webRequest, binderFactory);

        int pageNumber = Math.max(pageable.getPageNumber() - 1, 0);

        return PageRequest.of(pageNumber, pageable.getPageSize(), pageable.getSort());
    }
}
