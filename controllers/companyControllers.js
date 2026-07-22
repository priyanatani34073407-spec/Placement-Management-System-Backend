let companies = [
  {
    id: 101,
    companyName: "TCS",
    location: "Hyderabad",
    hrName: "Anas",
    email: "anasshaik382@gmail.com",
    phone: "7842386284",
    package: "10LPA",
    jobRole: "Developer",
    eligibility: "Python, Fullstack with MERN",
  },
];

// Get all companies
export function getCompanies(req, res) {
  res.status(200).json({
    success: true,
    companies,
  });
}

// Get company by ID
export function getCompanyById(req, res) {
  const id = Number(req.params.id);

  const company = companies.find((company) => company.id === id);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }

  res.status(200).json({
    success: true,
    company,
  });
}

// Add a company
export function addCompany(req, res) {
  const company = req.body;

  const existingCompany = companies.find(
    (c) => c.id === company.id
  );

  if (existingCompany) {
    return res.status(400).json({
      success: false,
      message: "Company ID already exists",
    });
  }

  companies.push(company);

  res.status(201).json({
    success: true,
    message: "Company registered successfully",
    company,
  });
}

// Update company
export function updateCompany(req, res) {
  const id = Number(req.params.id);
  const updatedCompany = req.body;

  let companyFound = false;

  companies = companies.map((company) => {
    if (company.id === id) {
      companyFound = true;
      return {
        ...company,
        ...updatedCompany,
      };
    }
    return company;
  });

  if (!companyFound) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Company updated successfully",
  });
}

// Delete company
export function deleteCompany(req, res) {
  const id = Number(req.params.id);

  const company = companies.find((company) => company.id === id);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }

  companies = companies.filter((company) => company.id !== id);

  res.status(200).json({
    success: true,
    message: "Company deleted successfully",
  });
      }
