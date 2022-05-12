package com.pms.processpension.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.pms.processpension.model.PensionDetail;
import com.pms.processpension.model.PensionerDetail;
import com.pms.processpension.model.ProcessPensionInput;
import com.pms.processpension.repository.PensionRepository;

@RestController
@CrossOrigin(origins = { "http://localhost:4200" })
@RequestMapping("/ProcessPension")
public class ProcessPensionController {

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private PensionRepository repository;

	@CrossOrigin(origins = { "http://localhost:4200" })
	@RequestMapping("/{processPensionInput}")
	public PensionDetail processPentionByAadhar(
			@PathVariable("processPensionInput") ProcessPensionInput processPensionInput, HttpServletRequest request) {

		HttpHeaders headers = new HttpHeaders();
		final String authorizationHeader = request.getHeader("Authorization");
		String token = authorizationHeader.substring(7);
		headers.set("Authorization", "Bearer " + token);

		String aadharId = processPensionInput.getAadharId();

		HttpEntity<PensionerDetail> requestEntity = new HttpEntity<PensionerDetail>(headers);

		restTemplate.exchange("http://localhost:8083/PensionerDetailByAadhaar/" + aadharId, HttpMethod.GET,
				requestEntity, PensionerDetail.class);

		PensionerDetail p = restTemplate.postForObject("http://localhost:8083/PensionerDetailByAadhaar/" + aadharId,
				requestEntity, PensionerDetail.class);
		double pensionAmount = CalculatePension.calculatePension(p.getSelfOrFamily(), p.getLastSalary(),
				p.getAllowances());
		int bankServiceCharge = CalculatePension.calculateBankServiceCharge(p.getPublicOrPrivateBank());
		PensionDetail detail = new PensionDetail(aadharId, pensionAmount, bankServiceCharge);
		repository.save(detail);
		return detail;

	}

}
