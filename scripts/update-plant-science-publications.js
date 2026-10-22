'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');

const CONTENT_TYPE_UID = 'api::plant-science-department.plant-science-department';
const LOCALE = 'en';

const PUBLICATIONS = [
  {
    title: 'SCI Journals',
    sortorder: 1,
    points: [
      'Rodrigo, V.H.L., Silva, T.U.K. and Munasinghe, E.S. (2004). Improving the spatial arrangement of planting rubber (Hevea brasiliensis Muell. Arg.) for long-term intercropping. Field Crops Research, 89, 327-335.',
      'Rodrigo, V.H.L., Stirling, C.M., Silva, T.U.K. and Pathirana, P.D. (2005). The growth and yield of rubber at maturity is improved by intercropping with banana during early stage of rubber cultivation. Field Crops Research, 91, 23-33.',
    ],
  },
  {
    title: 'Refereed Journals',
    sortorder: 2,
    points: [
      'Silva, T.U.K., Nugawela, A., Rodrigo, V.H.L., and Serasinghe, P. (2001). Effect of recovery tapping on yield potential of rubber (Hevea brasiliensis) trees. Jl. Rubb. Res. Inst. Sri Lanka, 84, 25-38.',
      'Rodrigo, V.H.L., Silva, T.U.K., Kariawasum, L.S. and Munasinghe, E.S. (2002). Rubber/timber intercropping systems and their impact on the performance of rubber. Jl. Rubb. Res. Inst. Sri Lanka, 85, 10-26.',
      'Silva, T.U.K., Senevirathne, P. and Bandara, K.A.G.B., (2012). Development of Ready Reckoner to assess the impact of excessive bark consumption in S/2 d2 and S/2 d3 harvesting systems. Jl. Rubb. Res. Inst. Sri Lanka, 92, 22-31.',
      'Nakandala S A, K D N Weerasinghe, P Seneviratne, S M M Iqbal, W G D Lakmini and P M P S Vijithasiri, (2016). Exogenous application of Salicylic Acid alleviates drought stress of rubber nursery plants in the Intermediate Zone of Sri Lanka. Journal of the Rubber Research Institute of Sri Lanka. 96 50 - 58',
      'T U K Silva, A M W K Senevirathna, P Seneviratne, W A J M De Costa and H Subasinghe (2017). Impact of different latex harvesting systems adopted by some growers on economic performance Jl. Rubb. Res. Inst. Sri Lanka, 97, 12-20.',
      'Nakandala, S.A., Weerasinghe, K.D.N., Seneviratne, P., Iqbal, S.M.M. and Pathirana, P.D. (2017). Role of salicylic acid in irrigation scheduling for rubber nurseries in the Intermediate Zone of Sri Lanka. Journal of the Rubber Research Institute of Sri Lanka 97, pp.21-34. http://doi.org/10.4038/jrrisl.v97i0.1879. (Published in 2021).',
      'Seneviratne, P., Nakandala S.A., Weerakoon, U.S. and Handapangoda, R. (2017). Effect of method of transplanting young budding plants on growth of rubber tree (Hevea brasiliensis Muell Arg). Journal of the Rubber Research Institute of Sri Lanka 97, 35-46, http://doi.org/10.4038/jrrisl.v97i0.1880. (Published in 2021).',
      'P Seneviratne, T U K Silva, K A G B Amaratunga, R P Karunasena, R K Samarasekara, L S Kariyawasam, M K P Perera, P D Pathirana and P K W Karunatilake (2018). Impact of tapping quality and harvesting practices on the sustainability of the rubber industry in Sri Lanka. Jl. of Rubber Research Institute of Sri Lanka. 98, 45-64',
      'Nakandala, S.A., Nayanakantha, N.M.C., Seneviratne, P., De Alwis M.N. and De Zoysa D.L.N. (2019). A study on different micro-irrigation techniques for mitigating water stress of immature rubber (Hevea brasiliensis) plants. Journal of the Rubber Research Institute of Sri Lanka 99, 87-94. http://doi.org/10.4038/jrrisl.v99i0.1891. (Published in 2021).',
      'Nayanakantha, N.M.C., Nakandala, S.A., Karunathilake, W., De Alwis, M.N., De Zoysa, L.N. and Seneviratne, P. (2019). Moringa oleifera leaf extract as a biostimulant on growth and other physio-chemical attributes of rubber (Hevea brasiliesnsis) under drought and heat stress conditions. Journal of the Rubber Research Institute of Sri Lanka 99, 23-35. http://doi.org/10.4038/jrrisl.v99i0.1885. (Published in 2021).',
      'Seneviratne, P, Nakandala, S A, Samarasekera, R K and Karunathilake, P K W. (2021). A study of different tapping times on latex production in smallholder rubber fields in Moneragala District in Sri Lanka. Journal of Rubber Research of Sri Lanka. 101. 65-78.',
      'De Alwis, W D M N, Nakandala, S A and de Zoysa, L. (2022). Effect of seed quantity on growth performance of rubber seedling plants and quality of planting material. Journal of Rubber Research of Sri Lanka. 102. 11-18.',
      'Nakandala S A and Nayanakantha, N M C. (2023). Effect of Chemical Priming on Growth and Abiotic Stress Alleviation in Rubber Nursery Plants. Journal of Plastic and Rubber Institute, Sri Lanka.',
      'Nakandala, S. A., Mallawaarachchi, I. S., Udayakumari, U. N., Silva, T. U. K., Liyanaarachchi, L. A. T. S., Karunarathne, N. P. S. N., Ratnayake, A. M. R. W. S. D., Warnasooriya, W. M. R. S. K., Malawalaarachchi, G. C., Fernando, L. T. B. K., & Piyarathne, P. N. M. S. (2025). Impact of seasonal floods on the growth and development of immature rubber plants (Hevea brasiliensis Mull. Arg.) in the Wet Zone of Sri Lanka: A case study in Kalutara District. Journal of Rubber Research of Sri Lanka. Vol 104. (Submitted on 28.03.2025, Accepted on 24.01.2026)',
    ],
  },
  {
    title: 'Bulletins',
    sortorder: 3,
    points: [
      'Seneviratne P, de Silva DSA (previous), Weerakoon U S, De Alwis M N, Zoysa L and Jayalath C (2007). The clonal composition of budwood nurseries and its role on the productivity of rubber in Sri Lanka, Bulletin of the Rubber Research Institute of Sri Lanka. 48. 1 – 7.',
      'Senevirathne, P., Nakandala, S., Bandara, K.A.G.B., Silva, T.U.K., Karunasena, R.P., Samarasekara, R.K., Perera, M.K.P., Alwis, M., Zoysa, L., Pathirana, P.D., Krunatilaka, W. and Handapangoda, R. (2011). Planting rubber at low densities in home gardens to sustain rural livelihood. bulletin. Rubb. Res. Inst. Sri Lanka, 52, 31-34.',
      'Seneviratne, P., Nayanakantha, N.M.C., Silva, T.U.K., Samarasekara, R.K. and Karunathilake, P.K.W. (2017). Field wise crop estimation ensures the sustainability of rubber plantations in Sri Lanka. Bull. Rub. Res. Inst. Sri Lanka. 54, 24-31.',
      'Nakandala, S.A., Seneviratne, P., Iqbal, S.M.M., Weerasinghe, K.D.N. and Pathirana, P.D. (2018). Irrigation systems for rubber nurseries. Bulletin of the Rubber Research Institute of Sri Lanka 54, 1-5.',
      'T U K Silva, N M C Nayanakantha and D Priyadarshana (2019). Potential of growing some economical crops along the boundaries of rubber plantations (56), p.44',
      'Nakandala., S.A. (2020). Climate-Smart Agriculture: An approach for adapting and building resilience to climate change. Bulletin of the Rubber Research Institute of Sri Lanka, 57.',
      'Seneviratne, P., Perera,M. K. P., Nakandala, S. A. and Handapangoda R. (2022). Growth and yield performances of pb 86 and rric 100 clones harvested with different tapping systems under wet climatic conditions in sri lanka. Bulletin of the Rubber Research Institute of Sri Lanka. 59. 35-42.',
      'Nakandala, S A., de Alwis, M N., Zoysa, D L N. and Nayanakantha, N M C. (2023). Use of Root-balled Plants to Fill the Vacancies in Immature Rubber Fields in the Intermediate Zone of Sri Lanka. Bulletin of the Rubber Research Institute of Sri Lanka. 60. 19-26.',
      'Balasooriya, B. M. D. C., Nakandala, S. A., Karunarathne, N P S N., and Munasinghe, E.S. (2025). Aligning Rubber Cultivation with Regenerative Agriculture Concepts. Bulletin of Rubber Research Institute of Sri Lanka. (Accepted)',
    ],
  },
  {
    title: 'Conference proceedings — International',
    sortorder: 4,
    points: [
      'Rodrigo, V.H.L., Stirling, C.M., Silva, T.U.K. and Pathirana, P.D. (2000). High density intercropping with banana reduces the length of the immature period of rubber and increases latex yield. Ind. Rubber Conf. and IRRDB Symp. 2000, pp. 490-500.',
      'Rodrigo, V.H.L., Silva, T.U.K., and Munasinghe, E.S. (2002). Feasibility of growing rubber/timber intercropping systems. Proceedings of the 11th International workshop of BIO-REFOR, Seoul, Korea. pp. 172-179.',
      'Nakandala, S A, K.D.N. Weerasinghe, P.Senaviratne, S.M.M Iqbal J. Jayasanka, and Pathirana, D. (2012). Impact of Salicylic acid treatment to enhance drought tolerance of nursery rubber plants when introducing the Monaragala District in the Intermediate zone of Sri Lanka . In: Proceedings of International Rubber Conference 2012, Kovalam, Kerala, India. 189-190',
      'Silva, T.U.K., and Rodrigo, V.H.L. (2015). Potential of increasing the planting density of rubber in Sri Lanka. Proceedings of the International Rubber Conference 2015. RRIV, Vietnam, 2-3, November 2015, Pp 577-590.',
      'Nayanakantha, N.M.C, R. M. Chathura G. Rathnayake, Suboda S. Panditharatne, Priyani. Seneviratne, Sashika A. Nakandala and Wasantha Karunathilake. Nitric oxide improves growth and physiological attributes of rubber (Hevea brasiliensis) under drought and heat stress conditions (2017). Proceedings of the International Rubber Conference, IRRDB, Indonesia, 18-22 October 2017, Jakarta, Indonesia. Pp 32.',
      'Wijayarathna, D.N., Lokupitiya, E. and Silva, T.U.K. (2018). Ratio between potential evapotranspiration and precipitation as a drought index and its impacts on rubber yield in Sri Lanka. Proceedings of 2nd International conference on climate change 2018. February 15th – 16th. 2018. Colombo, Sri Lanka. Pp 39.',
      'Nakandala S A, N M C Nayanakantha, P Seneviratne, M N de Alwis and D L N de Zoysa (2018) Morphological and physiological responses of immature plants of Heveabrasiliensis to Micro-irrigation. In: Proceedings of International Rubber Conference and IRRDB Annual meeting, 2018, Abidjan, Côte D’Ivoire. Pp. 53',
      'T.U.K. Silva, W.A. J. M. De Costa, A.M.W.K Senevirathna, P. Seneviratne and H. Subasinghe (2023). Influence of different latex harvesting systems and consequent bark consumption patterns on yield performance of different clones. Proceedings of the International Rubber Conference 2023. February 20th – 21st 2023. Kuala Lumpur, Malaysia. Pp 73.',
      'De Alwis, W.D.M.N., Nakandala, S.A. and Zoysa, L., (2024). Effect of seed quantity on growth performance of rubber seedling plants and quality of planting material. In: Proceedings of the International Rubber Conference 2024, International Rubber Research and Development Board, Thailand, 19–21 February 2024.',
      'De Alwis, W.D.M.N., Nakandala, S.A., Zoysa, L., Handapangoda, R. and Wickramakumarie, D., (2024). Enhancing rubber cultivation in non-traditional areas: evaluating the impact of root-balled planting technique on growth performance of young rubber plants. In: Proceedings of the International Rubber Conference 2024, International Rubber Research and Development Board, Indonesia, 19–21 November 2024.',
      'T U K Silva, H. Subasinghe, D. Priyadarshana and P G N Ishani (2025) Overall performance of three fruit crops under two spatial arrangements of rubber (Hevea brasiliensis Muell. Arg.) in the low country intermediate zone of Sri Lanka. Proceedings of the International Rubber Conference, Kuala Lumpur, Malaysia, December, 2025. P. 70.',
      'Chandrasena, K.K.L.S., Nakandala, S. A.,Udayakumari, U. N. and Bandusekara, B. S. (2025). Influence of Growing Media and Planting Techniques on the Growth of Young Rubber Plants Under Nursery Conditions. Proceedings of Extended Abstract of 1st International Symposium on Agro-Technology and Rural Sciences 2025. University of Colombo Institute for Agro-Technology and Rural Sciences.',
    ],
  },
  {
    title: 'Conference proceedings — Local',
    sortorder: 5,
    points: [
      'Silva, T.U.K., Rodrigo, V.H.L., and Subasinghe, S.M.C.U.P. (2006). Rubber latex production in Hevea brasiliensis with high density planting. Proceedings of the 11th International forestry and environmental symposium of the Department of Forestry and Environmental Science. University of Sri Jayewardenepura, Sri Lanka. December 2006. Kalutara, Page 7.',
      'Nakandala S A, Seneviratne P, Pathirana D, (2008). A study on irrigation systems for rubber nurseries in the Intermediate zone in Sri Lanka. In: Proceedings of the Second Symposium of Plantation Crop Research, Cococnut Research Instutue, Lunuwila, Sri Lanka, 307 – 310 (Best poster presentation in the Rubber sector, Second Plantation Crops Symposium – 2008 )',
      'Seneviratne P, Nakandala S A, Karunasena R P, (2008). The effect of low girth plants of Hevea brasiliensis (Mull.Arg) on the productivity, In: Proceedings of the Second Symposium of Plantation Crop Research, Cococnut Research Instutue, Lunuwila, Sri Lanka, 91- 95.',
      'Silva, T.U.K., Rodrigo, V.H.L., and Subasinghe, S.M.C.U.P. (2009). Timber production in high density planting of Hevea brasiliensis. Proceedings of the 14th International forestry and environmental symposium of the Department of Forestry and Environmental Science. University of Sri Jayewardenepura, Sri Lanka. December 2009, Page 33.',
      'Nakandala S A, K D N Weerasinghe, P Seneviratne, J Jayasanka and D Pathirana (2012). Use of Salicylic Acid in Irrigation Scheduling as a stress tolarance mediator in rubber nursery plants under water stress. In: Proceedings of 4th Symposium of Plantation Crop Research. Colombo Sri Lanka. Pp 241 – 251',
      'Nakandala S A, K D N Weerasinghe, P Seneviratne, S M M Iqbal and D Pathirana, (2013). Exogenous application of Salicylic acid with irrigation to alleviate drought stress of rubber nursery plants in the Intermediate zone of Sri Lanka. In: Proceedings of International Symposium of Agriculture and Environment (ISAE 2013). Faculty of Agriculture, University of Ruhuna. Pp 300-302',
      'Munasinghe S S P, S A Nakandala, C S de Silva, P Seneviratne, S M M Iqbal, and P D Pathirana.(2013). Performance assessment of technically specified and non-technically specified sprinkler irrigation systems in rubber nurseries in the Intermediate zone of Sri Lanka. In: Proceedings of Annual Academic Sessions 2013. The Open University of Sri Lanka Pp 27 – 31',
      'Nakandala S A, P Seneviratne, S M M Iqbal, S S P Munasinghe and D Pathirana.(2014). Performance and Cost effectiveness of three irrigation systems in a rubber nursery in the Intermediate Zone of Sri Lanka. Pp 91 -98. In A P Keerthipala (ed) Proceedings of the Fifth Symposium on Plantation Crop Research – “Towards a Green Plantation Economy”. Sugarcane Research Institute, UdaWalawa, 70190, Sri Lanka',
      'Silva, T.U.K., Senevirathne, A.M.W.K., Senevirathne, P. and Costa, W.A.J.M. (2016). Different latex harvesting systems and their impact on bark consumption and economic lifespan of rubber plantations in Sri Lanka. “International symposium on Agriculture and Environment 2016”, University of Ruhuna, Matara, Sri Lanka. Pp. 33-35.',
      'Silva, T.U.K., Senevirathne, A.M.W.K., Senevirathne, P., Costa, W.A.J.M., Samarasekara, R and Deshapriya, H.A.U..(2016). Impact of different latex harvesting systems on bark consumption, yield and economic lifespan of rubber plantations in Sri Lanka. Proceedings of theSixth Plantation Crop Research Symposium November 2-4, 2016. Bandaranaika Memorial International Conference Hall, Colombo, Sri Lanka. Pp 125-133.',
      'Wijayarathna, D.N., Lokupitiya, E. and Silva, T.U.K. (2018). Development of a relationship between a drought index and its impacts on rubber yield in wet zone. Proceedings of 74th Annual Session, Sri Lanka Association for the Advancement of Science, December2nd -8th. 2018. Colombo, Sri Lanka. Pp 27.',
      'Nayanakantha, N.M.C., B.M.S.S. Panditharatne, S.A. Nakandala, W. Karunathilake and P. Seneviratne (2018). Exogenous moringa oleifera leaf extract as a biostimulant improves growth and physiological attributes of rubber (Hevea brasiliesnsis) under sub-optimal climatic conditions. Proceedings of the symposium of RESCON 2018, 9-10th November 2018, PGIS, Peradeniya. Abstract, p. 58.',
      'N. M. C. Nayanakantha, S A Nakandala, W. Karunathilake, M N de Alwis, L N de Zoysa and P Seneviratne (2019). Moringa oleifera leaf extract as a biostimulant on growth and other physio-chemical attributes of rubber (Hevea brasiliensis) under drought and heat stress conditions. Proceedings of the Seventh Symposium on Plantation Crop Research. “Towards achieving sustainable development goals in the plantation sector. V.H.L. Rodrigo, B.W. Wijesuriya, D.G. Edirisinghe and N.M.C. Nayanakantha (Eds.). Rubber Research Institute of Sri Lanka, Dartonfield, Agalawatta, Sri Lanka, Vol.2, pp 115 – 126.',
      'Nakandala, S.A. N.M.C. Nayanakantha, P. Seneviratne, M.N.de Alwis and D.L.N. de Zoysa (2019). Different micro-irrigation techniques for mitigating drought stress of immature plants of Hevea brasiliensisIn: Proceedings of the seventh symposium on Plantation Crop Research. “Towards achieving sustainable development goals in the plantation sector. V.H.L. Rodrigo, B.W. Wijesuriya, D.G. Edirisinghe and N.M.C. Nayanakantha (Eds.). Rubber Research Institute of Sri Lanka, Dartonfield, Agalawatta, Sri Lanka, Vol.2, pp 13 – 20.',
      'T.U.K. Silva, P. Seneviratne, A.M.W.K Senevirathna, W.A. J. M. De Costa and H. Subasinghe (2020). Influence of some latex flow dynamics associated with different latex harvesting systems on latex yield of different clones of rubber (Hevea brasiliensis, Muell. Arg.). International symposium on Agriculture and Environment, February 14th, 2020. University of Ruhuna, Sri Lanka. Pp 23.',
      'Nakandala S A, K D N Weerasinghe, P Seneviratne and S M M Iqbal. (2020), Techno physiological approach to reduce drought stress of young rubber plantations in drought prone areas (A case study in Moneragala, Intermediate Zone of Sri Lanka ). Abstract Review. International Symposium on Multi- hazard early warning and disaster risk reduction. Virtual Conference, BMICH Colombo, Sri Lanka.',
      'U.L.R.T. Gunasinghe, B. Gajanayake, T.U.K. Silva, S. Lakmali and H. Subasinghe (2022). Impact of different latex harvesting systems on bark consumption and latex yield of Hevea brasiliensis. Proceedings of 20th Agricultural Research Symposium 2022. University of Wayamba, Sri Lanka. Pp 1-5.',
      'K.B.M.V.M.T.M. Muhandiram, T.U.K. Silva, W. Senevirathna, P. Wasana Jeewanthi (2022). Effect of High-Density planting on timber production and structural changes of rubber trees ((Hevea brasiliensis, Muell. Arg.). Annual Research Session – 2022, Faculty of Technology, Eastern University of Sri Lanka. P. 29.',
      'K.M.U. Madushankani, T.U.K. Silva, T.T.D. Darmarathna, A.M.W.K. Senvirathna (2022). Perofrmence of intercropped Annona muricata, Citrus sinensis Psidium guajava under two spatial arrangements of Hevea brasiliensis in low country intermediate zone of Sri Lanka. Proceedings of National Symposium, University of Uva-wellassa.',
      'Swarnamali, M.I., Nakandala, S A., Senevirathna, A.M.W.K. and Wickramakumari, W.M.D. (2022). study of exogenous application of Salicylic acid on the growth performance of rubber nursery plants under water stress conditions. Abstract. Academic Session 2022, Department of Export Agriculture. Faculty of Animal Science and Export Agriculture. Uva Wellassa University. Badulla. Sri Lanka.',
      'Nakandala S.A, Weerasinghe K D N and Seneviratne P. (2023). Exogenous Application of Salicylic Acid Alleviates Negative Effects of Drought Stress in Rubber Nurseries in the Intermediate Zone of Sri Lanka. Abstract Proceeding. International Conference on Building Resilience in Tropical Agro-ecosystems-2023. Galle face Hotel, Colombo, Sri Lanka.',
      'Seneviratne,P., Nakandala S A., Samarasekera, R.K. and Zoysa D.L.N. (2023). Evaluation of the crown budding technique on growth and yield attributes of high-yielding Hevea clones. Proceedings of International Symposium on Sustainable Plantation Management – 2023. National Institute of Plantation Management, Sri Lanka.',
      'Kalugalaarachchi, R.S., Nakandala, S A., Rasadari, N D K., Udayakumari, N. (2023). Increase the Productivity of Plants in Outer Space and Under Adverse Conditions. Proceeding of Science Research Projects Competition (SRPC), National Science Foundation (NSF), Sri Lanka.',
      'Amaya, M.A.W., Warakagoda, P.S. and Silva, T.U.K. (2024) In vitro establishment and shoot multiplication of nodal explants of Passiflora edulis: Variety Horana Gold”. Proceedings of 22nd Agricutural Research Symposium, Faculty of Agriculture and Plantation Management, University of Wayamba, Makandura, Sri Lanka. Pp. 186-190.',
      'Rasangi, P.G.K., Warakagoda, P.S. and Silva, T.U.K. (2024) Development of in vitro establishment and multiplication stages of Elettaria cardamom (Green cardamom). Proceedings of 22nd Agricutural Research Symposium, Faculty of Agriculture and Plantation Management, University of Wayamba, Makandura, Sri Lanka. Pp. 296-300.',
      'Dulani, S.M.S., Silva, T.U.K., Warnasooriya, W.M.R.S.K. and Piyarathne, P.N.MS. (2024). Evaluation of hat-type rainguards for tapping panel protection in rubber (Hevea brasiliensis, Muell. Arg.). Proceedings of 16th Annual Research Symposium 2024, Faculty of Agriculture, University of Rajarata, Sri Lanka. P. 124.',
      'Subashinee, A.V.M.S., Silva, T.U.K., Ishani, P.G.N., Warnasooriya, W.M.R.S.K. and Piyarathne, P.N.MS. (2024). Yield and financial assessment of high density pineapple (Ananas comosus) intercropping under immature rubber (Hevea brasiliensis, Muell. Arg.) plantation. Proceedings of 16th Annual Research Symposium 2024, Faculty of Agriculture, University of Rajarata, Sri Lanka. P. 144.',
      'Mallawaarachchi, I.S., Nakandala, S.A., Warnasooriya, W.M.R.S.K. , Piyarathne, P.N.M.S. , and Udayakumari, U.N. (2024). Impact of seasonal floods on the growth of immature rubber plants in the wet zone of Sri Lanka. Proceeding of 16th Annual Research Symposium, Faculty of Agriculture, Rajarata University of Sri Lanka.',
      'De Alwis, W.D.M.N., (2024). Enhancing rubber nursery production in Sri Lanka using porous root trainers (PRTs). In: Proceedings of Work Integrated Learning (WIL), Master of Agri-Enterprise & Technology Management (5th Intake - 2024/25). Wayamba University of Sri Lanka. (1st Place in Wayamba Presentation and People’s Award).',
      'Kaushalya, P.G.A.G., Silva, T.U.K., Abhiram, G. and Charithangi, P. (2025). Preliminary study on the comparison of tapping performance of motorized tapping machine and traditional tapping knife. Proceedings of the National Symposium on Agriculture and life science, NSLAS’25, 23rd January 2025, Uva Wellassa University, Badulla, Sri Lanka. P. 33.',
      'Jayangani, P.H.D.N, Nakandala, S.A, Weerasinghe, V.P.A, Udayakumari, U.N, Silva, T.U.K, Ratnayake, A.M.R.S.D, Subasinghe, H. and Karunatilake, P.K.W. (2025). Seasonal flooding and its influence on growth and latex yield of Hevea Rubber in Kalutara District in the wetzone of Sri Lanka. 37th Annual Congress 21st November 2025, Post Graduate Institute of Agriculture, University of Peradeniya, Sri Lanka. Pp. 33.',
      'Jayangani, P. H. D. N., Nakandala, S. A., Weerasinghe, V. P. A., Udayakumari, U. N., Silva, T. U. K., Ratnayake, A. M. R. W. S. D., Subasinghe, H., and Karunatilaka, P. K. W. (2025). Seasonal flooding and its impact on growth and latex yield of rubber (Hevea brasiliensis) in Kalutara District, Wet Zone of Sri Lanka. Proceedings of the 37th PGIA Annual Congress, University of Peradeniya, Sri Lanka.',
      'Liyanage, Y.L.S.N., Hettiarachchi, P.L., Dilpashan, L.T.C., Navodya, M.L.H., Jayasekara, A.G.B.P., Silva, T.U.K and Nakandala, S. A. (2025). Rubber Plant Nursery Management System. Abstract Proceeding, Annual Graduate Symposium, University of Moratuwa, Sri Lanka.',
    ],
  },
  {
    title: 'Rubber Puwath',
    sortorder: 6,
    points: [
      'සෂිකා නාකන්දල සහ ප්‍රියානි සෙනවිරත්න (2009). නව සහස්‍රයේ නව ප්‍රවණතා - රබර්පැළ තවාන් සඳහා ක්ෂුද්‍ර ජල සම්පාදන තාක්ෂණය භාවිතය. රබර් පුවත්. 26, 89 – 94',
      'ටී.යූ.කේ. සිල්වා, පී. සෙනෙවිරත්න සහ කේ.ඒ.ජී.බී. අමරතුංග (2011) කිරි කැපුම් පොත්ත අධික ලෙස වැයවීම හඳුනා ගැනීම සහ පාලනය සඳහා නිතැති ගණන් වගු (Ready reckoner) භාවිතා කළ හැකි ආකාරය. Rubber Puwath, Rubb. Res Inst. Sri Lanka. 59-65.',
      'පී.සෙනවිරත්න, කේ.ඒ.ජී.බී.අමරතුංග, ටී.යූ.කේ සිල්වා, ආර් .පී කරුණාසේන, එල්.එස් කාරියවසම්, ආර් .කේ සමරසේකර, එම්.කේ.පී පෙරේරා, ඩී. පතිරණ සහ ඩබ්.කරුණාතිලක (2018). රබර් වගාවේ කිරි කැපීම හෙවත් අස්වනු නෙලා ගැනීම Rubber Puwath, Rubb. Res Inst. Sri Lanka. 28-33.',
      'Silva, T.U.K. (2020) “රබර් වගාවේ ඵලදායිතාවය ඉහළදැමීම සඳහා වැඩි දියුණු කල හැකි සාධක කිහිපයක බලපෑම”. Rubber Puwath,Rubb. Res. Inst. Sri Lanka. 29, 6-9',
      'එස් ඒ නාකන්දල, පී සෙනවිරත්න, කේ.ඩී .එන් වීරසිංහ, එස්.එම්.එම් ඉක්බාල්, සහ පී.ඩී පතිරණ (2021). අහිතකර වියළි කාලතරණය කිරීමට ළපටි බද්ධ පැළ තවාන් සඳහා සැලිසිලික් අම්ලය සාර්ථකව භාවිතා කළ හැකිද? රබර් පුවත්.32,9-13',
      'පී.සෙනවිරත්න, එස්.ඒ නාකන්දල, මංජුල අල්විස්, ලක්නාත් ද සොයිස ා සහ පී.ඩී පතිරණ (2021). උසස් ගුණාංග සහිත බද්ධ රබර් පැළ නිෂ්පාදනය සඳහා රබර් බීජවල දායකත්වය සහ හොඳ බීජ තෙරා ගැනීමේ ක්‍රමවේදය. රබර් පුවත්. 32, 56-60.',
      'De Alwis, W.D.M.N., Zoysa, L. and Tharaka, H.L.T., 2022. විද්‍යාත්මක පැල තවාන් මගින්, තිරසාර සංවර්ධනයකට මං පෙත් එළි කරන රබර් කර්මාන්තය. බර් පුවත්, 34, pp.50–56.',
      'De Alwis, W.D.M.N., Zoysa, L., Wickramakumarie, D.W. and Tharaka, H.L., 2022. ශ්‍රී ලංකාවේ රබර් පැල තවාන් ඵලදායිතාව ඉහළ නැංවීම: උපාය මාර්ගික ප්‍රවේශයක් . බර් පුවත්, 34, pp.22–28',
      'Silva, T.U.K., D. Priyadarshana (2023) “රබර් වගාවේ මායිම් ප්‍රදේශය ඵලදායි ලෙස භාවිතා කරමු.”. Rubber Puwath, Rubber. Res. Inst. Sri Lanka. 35, 25-28.',
      'යූ.එන් . උදයකුමාරි ,එන්. .එම් .සී.නයනකාන්ත සහ එස් .ඒ නාකන්දල. (2023). රබර් බීජ ප්‍රරොහණය සහ බීජ පැළ වල වර්ධනය කෙරෙහි බීජ ප්‍රතිකාර භාවිතය, රබර් පුවත්, 35, pp.33–37.',
      'P.D. Pathirana, T.U.K. Silva, D. Priyadarshana (2026). “රබර් සමඟ එනසාල් වගාව”. Rubber Puwath, Rubb. Res. Inst. Sri Lanka. 38, 40-43.',
    ],
  },
  {
    title: 'Books/Book chapters',
    sortorder: 7,
    points: [
      'Silva, T.U.K (2011), “Ready Reckner to assess the impact of excessive bark consumption in S/2 d2 harvesting system”. ISBN 978-955-9022-19-0 Plant Science Department , Rubb. Res. Inst. Sri Lanka. 2011 July.',
      'Silva, T.U.K (2016), Rubber based farming systems in Sri Lanka, Session 14, Distance Learning Module – Rubber (Agronomy) Volume 2, (pp 69-90) National Institute of Plantation Management, Athurugiriya. Sri Lanka.',
      'Silva, T.U.K., (2021), Rubber based intercropping systems, In: Rodrigo, V.H.L, Seneviratne P. (Eds.) A Hand Book of Rubber Agronomy Vol. 1. (pp. 178–196). Rubber Research Institute of Sri Lanka.',
      'Seneviratne,P.and Nakandala, S. (2021). Management of rootstock and budwood nurseries In: Handbook of Rubber Vol. 1: Agronomy, pp. (Eds. V.H.L. Rodrigo and P. Seneviratne), Rubber Research Institute of Sri Lanka, Dartonfield, Agalawatta,12200, Sri Lanka.',
      'Silva, T.U.K (2023), “Ready Reckner to assess the impact of excessive bark consumption in S/2 d3 harvesting system”. ISBN 978-624-5806-03-4 Plant Science Department , Rubb. Res. Inst. Sri Lanka. 2023 February.',
    ],
  },
];

function toPoints(entries) {
  return entries.map((paragraph) => ({ paragraph }));
}

function getPopulate() {
  return {
    publicationssection: {
      populate: {
        rightimage: true,
        publications: {
          populate: {
            points: true,
          },
        },
      },
    },
  };
}

async function findDepartment(repository) {
  return (
    (await repository.findFirst({ locale: LOCALE, status: 'published', populate: getPopulate() })) ||
    repository.findFirst({ locale: LOCALE, status: 'draft', populate: getPopulate() })
  );
}

function assertPublishedResult(department) {
  if (department?.publicationspresent !== true) {
    throw new Error('Publications verification failed: publicationspresent is not enabled.');
  }

  const section = department?.publicationssection;

  if (section?.sectiontitle?.trim() !== 'Publications') {
    throw new Error('Publications verification failed: section title is not Publications.');
  }

  const cards = section?.publications || [];

  if (cards.length !== PUBLICATIONS.length) {
    throw new Error(
      `Publications verification failed: expected ${PUBLICATIONS.length} categories, found ${cards.length}.`
    );
  }

  for (const expected of PUBLICATIONS) {
    const actual = cards.find((card) => card?.sortorder === expected.sortorder);

    if (!actual) {
      throw new Error(
        `Publications verification failed: missing category sortorder ${expected.sortorder}.`
      );
    }

    if (actual.title?.trim() !== expected.title) {
      throw new Error(
        `Publications verification failed: unexpected title for sortorder ${expected.sortorder}.`
      );
    }

    const pointCount = actual.points?.length || 0;

    if (pointCount !== expected.points.length) {
      throw new Error(
        `Publications verification failed: expected ${expected.points.length} entries for "${expected.title}", found ${pointCount}.`
      );
    }
  }
}

async function main() {
  const appContext = await compileStrapi({ appDir: process.cwd() });
  const app = createStrapi(appContext);

  try {
    await app.load();

    const repository = app.documents(CONTENT_TYPE_UID);
    const department = await findDepartment(repository);

    if (!department?.documentId) {
      throw new Error(`English Plant Science Department document was not found (${CONTENT_TYPE_UID}).`);
    }

    await repository.update({
      documentId: department.documentId,
      locale: LOCALE,
      data: {
        publicationspresent: true,
        publicationssection: {
          sectiontitle: 'Publications',
          publications: PUBLICATIONS.map((category) => ({
            title: category.title,
            sortorder: category.sortorder,
            points: toPoints(category.points),
          })),
        },
      },
    });

    await repository.publish({
      documentId: department.documentId,
      locale: LOCALE,
    });

    const updatedDepartment = await repository.findOne({
      documentId: department.documentId,
      locale: LOCALE,
      status: 'published',
      populate: getPopulate(),
    });

    assertPublishedResult(updatedDepartment);

    const totalEntries = PUBLICATIONS.reduce((sum, category) => sum + category.points.length, 0);

    console.log(
      `Updated and published the ${LOCALE} Plant Science publications section with ${PUBLICATIONS.length} categories and ${totalEntries} entries (right image left for CMS).`
    );
  } finally {
    if (app.isLoaded) {
      await app.destroy();
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to update the Plant Science publications section.');
    console.error(error);
    process.exit(1);
  });
