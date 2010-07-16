package org.exoplatform.ecm.REST.category;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.jcr.ItemNotFoundException;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.exoplatform.common.http.HTTPStatus;
import org.exoplatform.services.cms.link.LinkManager;
import org.exoplatform.services.cms.taxonomy.TaxonomyService;
import org.exoplatform.services.cms.templates.TemplateService;
import org.exoplatform.services.jcr.core.ManageableRepository;
import org.exoplatform.services.log.ExoLogger;
import org.exoplatform.services.log.Log;
import org.exoplatform.services.rest.resource.ResourceContainer;

/**
 * Get categories and documents belonging to category. <br>
 * 1. Url pattern = * /categories/all/{repoName}/{catePath:.*} (* /categories/all/{repoName} ) if catePath = ""
 * then return all category in repository. if catePath != "" then return all categories and
 * document defined in
 * {@link org.exoplatform.services.cms.templates.TemplateService#getAllDocumentNodeTypes(String)
 * (TemplateService.getAllDocumentNodeTypes)}. Result returned is json object of
 * {@link CategoryNode} <br>
 * 2. Url pattern = * /categories/articles/{repoName}/{catePath:.*}/: catePath
 * is (Category path or Category/document path) if catePath points to category
 * node: Return all document in this CategoryNode {@link CategoryNode} if
 * catePath points to a document node: Return this document node
 * {@link DocumentContent}
 * 
 * @author hoanghung JUL 01, 2010
 */

@Path("/categories/")
public class CategoryContentRESTService implements ResourceContainer {

	private TaxonomyService taxonomyService_;
	private TemplateService templateService_;
	private LinkManager linkManager_;
	private static final Log LOG = ExoLogger
			.getLogger(CategoryContentRESTService.class.getName());

	private List<String> documentTypes = new ArrayList<String>();
	
	public CategoryContentRESTService(TaxonomyService taxonomyService,
			TemplateService templateService, LinkManager linkManager)
			throws Exception {
		taxonomyService_ = taxonomyService;
		templateService_ = templateService;
		linkManager_ = linkManager;
	}

	@GET
	@Path("/all/{repoName}/{catePath:.*}/")
	public Response getCategory(@PathParam("repoName") String repoName,
			@PathParam("catePath") String catePath) {
		List<CategoryNode> listCategoryNode = new ArrayList<CategoryNode>();
			if (catePath != null && !catePath.trim().isEmpty()) {
				String taxonomyTree = catePath.split("/")[0];
				String path = catePath.substring(taxonomyTree.length());
				if (path.startsWith("/")) {
					path = path.substring(1);
				}
				try {
					Node taxonomyTreeNode = taxonomyService_.getTaxonomyTree(repoName,
							taxonomyTree);
					if (taxonomyTreeNode == null)
						throw new PathNotFoundException("Can't find category " + taxonomyTree);
					Node category;
					NodeIterator iterNode;
					if (path.equals("")) {
						iterNode = taxonomyTreeNode.getNodes();
					} else {
						iterNode = taxonomyTreeNode.getNode(path).getNodes();
					}
					CategoryNode categoryNode;
					while (iterNode.hasNext()) {
						category = iterNode.nextNode();
						categoryNode = getCategoryNode(category, makePath(category, taxonomyTreeNode));
						if (categoryNode != null)
							listCategoryNode.add(categoryNode);
					}
				} catch (PathNotFoundException exc) {
					LOG.error("Path Not found " + exc.getMessage(), exc);
					return Response.status(HTTPStatus.NOT_FOUND).entity(exc.getMessage())
							.build();
				} catch (Exception e) {
					LOG.error(e);
					return Response.serverError().build();
				}

			}
		ListResultNode listResultNode = new ListResultNode();
		Collections.sort(listCategoryNode, new NameComparator());
		listResultNode.setLstNode(listCategoryNode);
		return Response.ok(listResultNode, new MediaType("application", "json"))
				.build();
	}

	@GET
	@Path("/all/{repoName}")
	public Response getCategory(@PathParam("repoName") String repoName) {
		List<CategoryNode> listCategoryNode = new ArrayList<CategoryNode>();
		if (repoName == null || repoName.trim().isEmpty()) {
			return Response.status(HTTPStatus.NOT_FOUND).entity(
					new RepositoryException("Can't find repository")).build();
		}
		// Get all category
		try {
			if (documentTypes.isEmpty())
				documentTypes = templateService_.getAllDocumentNodeTypes(repoName);
			List<Node> categoryNodes = taxonomyService_.getAllTaxonomyTrees(repoName);
			for (Node rootCategoryNode : categoryNodes) {
				getTaxnomyNodeRescursive(rootCategoryNode, rootCategoryNode, listCategoryNode);
			}
		} catch (Exception e) {
			LOG.error(e);
			return Response.serverError().build();
		}
		ListResultNode listResultNode = new ListResultNode();
		listResultNode.setLstNode(listCategoryNode);
		return Response.ok(listResultNode, new MediaType("application", "json"))
				.build();
	}

	@GET
	@Path("/articles/{repoName}/{docPath:.*}/")
	public Response getArticles(@PathParam("repoName") String repoName,
			@PathParam("docPath") String docPath) {
		DocumentContent docNode = null;
		ListResultNode listResultNode = new ListResultNode();
		if (docPath != null) {
			String taxonomyTree = docPath.split("/")[0];
			String path = docPath.substring(taxonomyTree.length());
			if (path.startsWith("/")) {
				path = path.substring(1);
			}
			try {
				if (documentTypes.isEmpty())
					documentTypes = templateService_.getAllDocumentNodeTypes(repoName);
				Node taxonomyNode = taxonomyService_.getTaxonomyTree(repoName,
						taxonomyTree);
				if (taxonomyNode == null)
					throw new PathNotFoundException("Can't find category " + taxonomyTree);
				if (!path.equals("")) {
					taxonomyNode = taxonomyNode.getNode(path);
				}
				if (linkManager_.isLink(taxonomyNode)) {
					List<Node> taxonomyTrees = taxonomyService_.getAllTaxonomyTrees(repoName); 	
					docNode = getArticleContent(linkManager_.getTarget(taxonomyNode), taxonomyTrees);
					return Response.ok(docNode, new MediaType("application", "json"))
							.build();
				} else if (taxonomyNode.isNodeType("exo:taxonomy")) {
					listResultNode.setLstNode(getArticleNode(taxonomyNode,
							documentTypes));
					Collections.sort(listResultNode.getLstNode(), new NameComparator());
					return Response.ok(listResultNode,
							new MediaType("application", "json")).build();
				}
			} catch (PathNotFoundException exc) {
				LOG.error("Path Not found " + exc.getMessage(), exc);
				return Response.status(HTTPStatus.NOT_FOUND).entity(exc.getMessage())
						.build();
			} catch (Exception e) {
				LOG.error(e);
				return Response.serverError().build();
			}
		}
		return Response.ok().build();
	}

	private CategoryNode getCategoryNode(Node node, String parentPath) {
		
		CategoryNode categoryNode = null;
		try {
			if (node.isNodeType("exo:taxonomy")) {
				categoryNode = new CategoryNode(node.getName(), "", parentPath,
						getType(node));
			} else if (linkManager_.isLink(node)) {
				// In case document type, don't need parentId
				node = linkManager_.getTarget(node);
				categoryNode = new CategoryNode(node.getName(), "", "",
						getType(node));
			}
		} catch (ItemNotFoundException e) {
			LOG.error(e);
		} catch (RepositoryException e) {
			LOG.error(e);
		} catch (Exception e) {
			LOG.error(e);
		}
		return categoryNode;
	}

	/**
	 * Get content of document node. Content is got by exo:content or exo:text or exo:summary 
	 * @param node
	 * @return
	 * @throws Exception
	 */
	private DocumentContent getArticleContent(Node node, List<Node> taxonomyTrees) throws Exception {
		DocumentContent documentContent = new DocumentContent(node.getName(), getIcon(node), "", getType(node));
		// If node is added mix rss-enabled then get exo:content property
		if (node.hasProperty("exo:content")) {
			documentContent.setContent(node.getProperty("exo:content").getString());
		}
		// Some node have exo:text so we override value of exo:content
		if (node.hasProperty("exo:text")) {
			documentContent.setContent(node.getProperty("exo:text").getString());
		}
		// Some node have exo:summary so we override value of exo:content
		if (node.hasProperty("exo:summary")) {
			documentContent.setContent(node.getProperty("exo:summary").getString());
		}
  	
		List<Node> categories = taxonomyService_.getAllCategories(node);
		
		CategoryNode categoryNode;
		for (Node category : categories) {
			categoryNode = getCategoryNode(category, "");
			for (Node taxonomyTree : taxonomyTrees) {
				if (category.getPath().contains(taxonomyTree.getPath())) {
					categoryNode.setParentPath((category.getParent().getPath().replace(taxonomyTree.getParent().getPath(), "")));
					break;
				}
			}
			if (categoryNode != null)
				documentContent.getCategories().add(categoryNode);
		}
		return documentContent;
	}

	private List<DocumentContent> getArticleNode(Node node,
			List<String> allDocumentType) throws Exception {
		List<DocumentContent> docs = new ArrayList<DocumentContent>();
		NodeIterator nodes = node.getNodes();
		Node docNode;
		List<Node> taxonomyTrees = taxonomyService_.getAllTaxonomyTrees(((ManageableRepository) node.getSession().getRepository())
				.getConfiguration().getName());
		while (nodes.hasNext()) {
			docNode = nodes.nextNode();
			if (linkManager_.isLink(docNode)) {
				docNode = linkManager_.getTarget(docNode);
				if (allDocumentType.contains(docNode.getPrimaryNodeType().getName())) {
					docs.add(getArticleContent(docNode, taxonomyTrees));
				}
			}
		}
		return docs;
	}

	private String getIcon(Node node) {
		return "";
	}

	private String getType(Node node) throws Exception {
		if (node.isNodeType("exo:taxonomy")) {
			return "category";
		} else if (documentTypes.contains(node.getPrimaryNodeType().getName())) {
			return "article";
		}
		return "";
	}

	/**
	 * Put all category from rootTree to list categories
	 * @param rootTree
	 * @param categories
	 * @throws RepositoryException
	 */
	private void getTaxnomyNodeRescursive(Node rootTree, Node currentCategory, List<CategoryNode> categories) throws RepositoryException {
		NodeIterator nodes = currentCategory.getNodes();
		if (currentCategory.isNodeType("exo:taxonomy")) {
			CategoryNode categoryNode = getCategoryNode(currentCategory, makePath(currentCategory, rootTree));
			if (categoryNode != null)
				categories.add(categoryNode);
			while (nodes.hasNext()) {
				getTaxnomyNodeRescursive(rootTree, nodes.nextNode(), categories);
			}
		}
	}

	private String makePath(Node node, Node rootTree) {
		try {
			return node.getParent().getPath().replace(rootTree.getParent().getPath(), "");
		} catch (Exception e) {
			LOG.error("Make Path fail", e);
		}
		return "";
	}
	public class CategoryNode {

		private String name;
		private String icon;

		private String parentPath;

		private String type;

		public CategoryNode(String name, String icon, String parentPath,
				String type) {
			this.name = name;
			this.icon = icon;
			this.setParentPath(parentPath);
			this.type = type;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getIcon() {
			return icon;
		}

		public void setIcon(String icon) {
			this.icon = icon;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public void setParentPath(String parentPath) {
			this.parentPath = parentPath;
		}

		public String getParentPath() {
			return parentPath;
		}

	}

	public class DocumentContent extends CategoryNode {
		private String content;
		private List<CategoryNode> categories = new ArrayList<CategoryNode>();

		public DocumentContent(String name, String icon, String parentPath, String type) {
			super(name, icon, parentPath, type);
		}

		public void setContent(String content) {
			this.content = content;
		}

		public String getContent() {
			return content;
		}

		public void setCategories(List<CategoryNode> categories) {
			this.categories = categories;
		}

		public List<CategoryNode> getCategories() {
			return categories;
		}
	}

	public class ListResultNode {

		private List<? extends CategoryNode> lstNode;

		public List<? extends CategoryNode> getLstNode() {
			return lstNode;
		}

		public void setLstNode(List<? extends CategoryNode> lstNode) {
			this.lstNode = lstNode;
		}
	}
	
	public class NameComparator implements Comparator<CategoryNode> {
		@Override
		public int compare(CategoryNode o1, CategoryNode o2) {
			return o1.getName().compareTo(o2.getName());
		}
	}
	
}